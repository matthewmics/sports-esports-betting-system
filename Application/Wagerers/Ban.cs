using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;

namespace Application.Wagerers
{
    public class Ban
    {

        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IHubContext<MainHub> _hubContext;

            public Handler(DataContext context, IHubContext<MainHub> hubContext)
            {
                _context = context;
                _hubContext = hubContext;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var wagerer = await _context.Wagerers.Include(x => x.AppUser)
                                .SingleOrDefaultAsync(x => x.AppUserId == request.Id);
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Wagerer not found" });

                wagerer.Banned = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    await _hubContext.Clients.User(wagerer.AppUser.Email).SendAsync("Banned");
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");
            }
        }

    }
}
