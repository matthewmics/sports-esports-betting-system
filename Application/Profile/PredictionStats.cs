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
using Application.Prediction;

namespace Application.Profile
{
    public class PredictionStats
    {

        public class Query : IRequest<PredictionStatsDto> { }

        public class Handler : IRequestHandler<Query, PredictionStatsDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IPredictionOutcomeReader _outcomeReader;

            public Handler(DataContext ctx, IMapper mapper, IUserAccessor userAccessor, IPredictionOutcomeReader outcomeReader)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _outcomeReader = outcomeReader;
            }

            public async Task<PredictionStatsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var wagerer = await _ctx.Wagerers
                    .Include(x => x.AppUser).SingleOrDefaultAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());

                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { User = "Not found" });

                var wagererStats = await _ctx.WagererStats.SingleOrDefaultAsync(x => x.WagererId == wagerer.AppUserId);

                if (wagererStats == null || DateTime.Now.AddMinutes(-10) > wagererStats.UpdatedAt)
                {
                    var userSettledPredictions = await _ctx.UserPredictions
                        .Include(x => x.Prediction)
                            .ThenInclude(x => x.Match)
                        .Where(x => x.Prediction.PredictionStatusId == Domain.PredictionStatus.Settled &&
                               x.WagererId == wagerer.AppUserId)
                        .ToListAsync();

                    var monthlyEarnings = 0m;
                    foreach (var item in userSettledPredictions.Where(x => x.PredictedAt > DateTime.Now.AddDays(-30)))
                    {
                        monthlyEarnings += _outcomeReader.Read(item);
                    }
                    var totalEarnings = 0m;
                    foreach (var item in userSettledPredictions)
                    {
                        totalEarnings += _outcomeReader.Read(item);
                    }

                    if (wagererStats == null)
                    {
                        wagererStats = new Domain.WagererStats
                        {
                            UpdatedAt = DateTime.Now,
                            PredictionTotal = userSettledPredictions.Count(),
                            PredictionValue = (int)userSettledPredictions.Sum(x => x.Amount),
                            MonthlyEarnings = monthlyEarnings,
                            AllTimeEarnings = totalEarnings,
                            Wagerer = wagerer
                        };
                        _ctx.WagererStats.Add(wagererStats);
                    }
                    else
                    {
                        wagererStats.PredictionTotal = userSettledPredictions.Count();
                        wagererStats.PredictionValue = (int)userSettledPredictions.Sum(x => x.Amount);
                        wagererStats.UpdatedAt = DateTime.Now;
                        wagererStats.MonthlyEarnings = monthlyEarnings;
                        wagererStats.AllTimeEarnings = totalEarnings;
                    }

                    await _ctx.SaveChangesAsync();
                }

                return _mapper.Map<PredictionStatsDto>(wagererStats);
            }
        }

    }
}
