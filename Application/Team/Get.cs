using Application.Errors;
using AutoMapper;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Application.Team
{
    public class Get
    {

        public class Query : IRequest<TeamDto>
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, TeamDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async System.Threading.Tasks.Task<TeamDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var team = await _ctx.Teams.FindAsync(request.Id);

                if (team == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Team = "Team not found" });

                return _mapper.Map<TeamDto>(team);
            }
        }

    }
}
