using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using Application.Match.Dtos;
using AutoMapper;
using System.Linq;

namespace Application.Match
{
    public class Recent
    {

        public class Query : IRequest<List<MatchRecentDto>> { }

        public class Handler : IRequestHandler<Query, List<MatchRecentDto>>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async Task<List<MatchRecentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var recentMatches = await _ctx.Matches
                    .Include(x => x.TeamA)
                    .Include(x => x.TeamB)
                    .Include(x => x.Predictions)
                    .Where(x => x.Predictions.Single(x => x.IsMain).PredictionStatusId == Domain.PredictionStatus.Settled)
                    .OrderByDescending(x => x.Predictions.Single(x => x.IsMain).SettledDate)
                    .Take(25)
                    .ToListAsync();

                return _mapper.Map<List<MatchRecentDto>>(recentMatches);
            }
        }

    }
}
