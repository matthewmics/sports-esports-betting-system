using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Profile.Dtos;
using AutoMapper;
using Application.Interfaces;

namespace Application.Profile
{
    public class PredictionStats
    {

        public class Query : IRequest<PredictionStatsDto>
        {

        }

        public class Handler : IRequestHandler<Query, PredictionStatsDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext ctx, IMapper mapper, IUserAccessor userAccessor)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<PredictionStatsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var wagerer = await _ctx.Wagerers
                    .Include(x => x.AppUser).SingleOrDefaultAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());

                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { User = "Not found" });

                var userSettledPredictions = await _ctx.UserPredictions
                    .Where(x => x.Prediction.PredictionStatusId == Domain.PredictionStatus.Settled &&
                           x.WagererId == wagerer.AppUserId)
                    .ToListAsync();

                var profile = new PredictionStatsDto
                {
                    PredictionTotal = userSettledPredictions.Count(),
                    PredictionValue = (int)userSettledPredictions.Sum(x => x.Amount),
                };

                return profile;
            }
        }

    }
}
