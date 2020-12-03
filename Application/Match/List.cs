using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Application.Match
{
    public class List
    {
        public class Query : IRequest<MatchEnvelope>
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string Game { get; set; }
        }

        public class Handler : IRequestHandler<Query, MatchEnvelope>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async System.Threading.Tasks.Task<MatchEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _ctx.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .Include(x => x.Game)
                .OrderBy(x => x.StartDate)
                .AsQueryable();

                if (request.Game != null && request.Game != "all")
                {
                    switch (request.Game)
                    {
                        case "dota2":
                            queryable = queryable.Where(x => x.GameId == Game.Dota2);
                            break;
                        case "csgo":
                            queryable = queryable.Where(x => x.GameId == Game.Csgo);
                            break;
                        case "sports":
                            queryable = queryable.Where(x => x.GameId == Game.Sports);
                            break;
                    }
                }

                var matches = await queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 10).ToListAsync();

                var matchEnvelope = new MatchEnvelope
                {
                    Matches = _mapper.Map<List<MatchDto>>(matches),
                    MatchCount = queryable.Count()
                };

                return matchEnvelope;
            }
        }
    }

}
