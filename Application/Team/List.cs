using Application.Team.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Application.Team
{
    public class List
    {

        public class Query : IRequest<TeamEnvelope>
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string Q { get; set; } // Search term
            public string SortBy { get; set; }
            public string OrderBy { get; set; }

        }

        public class Handler : IRequestHandler<Query, TeamEnvelope>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async System.Threading.Tasks.Task<TeamEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {

                System.Linq.Expressions.Expression<Func<Domain.Team, object>>
                    sortAs = request.SortBy switch
                    {
                        "createdAt" => x => x.CreatedAt,
                        _ => x => x.Name,
                    };

                var queryable = request.OrderBy == "desc" ?
                    _ctx.Teams.OrderByDescending(sortAs).AsQueryable() :
                    _ctx.Teams.OrderBy(sortAs).AsQueryable();

                if (!string.IsNullOrEmpty(request.Q))
                {
                    queryable = queryable.Where(x => x.Name.Contains(request.Q));
                }

                var teams = queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToList();

                var teamEnvelope = new TeamEnvelope
                {
                    Teams = _mapper.Map<ICollection<TeamDto>>(teams),
                    TeamCount = await queryable.CountAsync(),
                };

                return teamEnvelope;
            }
        }

    }
}
