using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Match
{
    public class Get
    {

        public class Query : IRequest<MatchDto>
        {
            public int Id { get; set; }
            public Query(int id)
            {
                Id = id;
            }

        }

        public class Handler : IRequestHandler<Query, MatchDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async System.Threading.Tasks.Task<MatchDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var match = await _ctx.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .Include(x => x.Game)
                .SingleOrDefaultAsync(x => x.Id == request.Id);

                //if (match == null)
                //    return NotFound(new { error = "match not found" });

                var matchToReturn = _mapper.Map<MatchDto>(match);

                return matchToReturn;
            }

        }

    }
}
