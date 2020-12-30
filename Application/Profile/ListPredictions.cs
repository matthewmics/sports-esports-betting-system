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
using Domain;
using Application.Interfaces;

namespace Application.Profile
{
    public class ListPredictions
    {
        public class UserPredictionEnvelope
        {
            public ICollection<UserPredictionDto> UserPredictions { get; set; }
            public int UserPredictionCount { get; set; }
        }

        public class Query : IRequest<UserPredictionEnvelope>
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string Outcome { get; set; }
            public string Game { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserPredictionEnvelope>
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

            public async Task<UserPredictionEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var wagerer = await _ctx.Wagerers
                    .SingleAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());

                var queryable = _ctx.UserPredictions
                    .Where(x => x.WagererId == wagerer.AppUserId)
                    .Include(x => x.Prediction)
                        .ThenInclude(x => x.Match)
                            .ThenInclude(x => x.TeamA)
                    .Include(x => x.Prediction)
                        .ThenInclude(x => x.Match)
                            .ThenInclude(x => x.TeamB)
                    .Include(x => x.Prediction)
                        .ThenInclude(x => x.Match)
                            .ThenInclude(x => x.Game)
                    .OrderByDescending(x => x.PredictedAt)
                    .AsQueryable();

                switch (request.Outcome ?? "all")
                {
                    case "ongoing":
                        queryable = queryable.Where(x => x.Prediction.PredictionStatusId == Domain.PredictionStatus.Open ||
                                                 x.Prediction.PredictionStatusId == Domain.PredictionStatus.Live);
                        break;
                    case "won":
                        queryable = queryable.Where(x => x.Prediction.PredictionStatusId == Domain.PredictionStatus.Settled &&
                                                 x.Prediction.WinnerId == x.TeamId);
                        break;
                    case "lost":
                        queryable = queryable.Where(x => x.Prediction.PredictionStatusId == Domain.PredictionStatus.Settled &&
                                                 x.Prediction.WinnerId != x.TeamId);
                        break;
                    case "cancelled":
                        queryable = queryable.Where(x => x.Prediction.PredictionStatusId == Domain.PredictionStatus.Cancelled);
                        break;
                }

                switch (request.Game ?? "all")
                {
                    case "dota2":
                        queryable = queryable.Where(x => x.Prediction.Match.GameId == Domain.Game.Dota2);
                        break;
                    case "csgo":
                        queryable = queryable.Where(x => x.Prediction.Match.GameId == Domain.Game.Csgo);
                        break;
                    case "sports":
                        queryable = queryable.Where(x => x.Prediction.Match.GameId == Domain.Game.Sports);
                        break;
                }

                var userPredictions = await queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 10).ToListAsync();

                var userPredictionsMapped = _mapper.Map<List<UserPredictionDto>>(userPredictions);

                return new UserPredictionEnvelope
                {
                    UserPredictionCount = await queryable.CountAsync(),
                    UserPredictions = userPredictionsMapped
                };
            }
        }

    }
}
