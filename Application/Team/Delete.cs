using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;

namespace Application.Team
{
    public class Delete
    {

        public class Command : IRequest
        {
            public int TeamId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var team = await _context.Teams
                    .Include(x => x.TeamAMatches)
                    .Include(x => x.TeamBMatches)
                    .SingleOrDefaultAsync(x => x.Id == request.TeamId);

                if (team == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Team = "Team not found" });

                if (team.TeamAMatches.Count > 0 ||
                    team.TeamBMatches.Count > 0)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest,
                        new { Team = "Cannot delete a team that has already participated in a match" });

                _context.Teams.Remove(team);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
