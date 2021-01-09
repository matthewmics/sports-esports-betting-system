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

namespace Application.Wagerers
{
    public class Unban
    {

        public class Command : IRequest
        {
            public string Id { get; set; }
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
                var wagerer = await _context.Wagerers.FindAsync(request.Id);
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Wagerer not found" });

                wagerer.Banned = false;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
