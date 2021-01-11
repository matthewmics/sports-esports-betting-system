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
using Application.Interfaces;

namespace Application.Prediction
{
    public class ReadPredictionNotification
    {

        public class Command : IRequest
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var wagerer = _context.Wagerers.SingleOrDefaultAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "User not found" });

                var notifc = await _context.PredictionNotification.FindAsync(request.Id);
                if (notifc == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Notification = "Notification not found" });

                notifc.Read = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
