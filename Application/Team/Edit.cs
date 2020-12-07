using Application.Errors;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Team
{
    public class Edit
    {

        public class Command : IRequest
        {
            public string Name { get; set; }
            public int Id { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty().NotNull();
            }
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
                var team = await _context.Teams.FindAsync(request.Id);

                if (team == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Team = "Team not found" });

                if(await _context.Teams.AnyAsync(x => x.Name == request.Name))
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, 
                        new { Team = $"Name '{request.Name}' already exists" });

                team.Name = request.Name;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
