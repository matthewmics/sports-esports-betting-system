using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using Application.Paypal.Dtos;
using Microsoft.AspNetCore.SignalR;
using Application.Profile.Dtos;
using Application.Hubs;

namespace Application.Paypal
{
    public class CaptureDeposit
    {

        public class Command : IRequest
        {
            public string OrderId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPaypalAccessor _paypalAccessor;
            private readonly IHubContext<MainHub> _hubContext;

            public Handler(DataContext context, IPaypalAccessor paypalAccessor,
                IHubContext<MainHub> hubContext)
            {
                _context = context;
                _paypalAccessor = paypalAccessor;
                _hubContext = hubContext;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var order = await _context.PaypalOrders.FindAsync(request.OrderId);
                if (order == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { PaypalOrder = "Not found" });

                var result = _paypalAccessor.CaptureOrder(request.OrderId);

                if (result.Status != "COMPLETED")
                    throw new Exception("Something went wrong while capturing order");

                order.IsCaptured = true;
                order.CapturedDate = DateTime.Now;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    var wagerer = await _context.Wagerers
                        .Include(x => x.AppUser)
                        .SingleAsync(x => x.AppUserId == order.WagererId);

                    await _hubContext.Clients.User(wagerer.AppUser.Email)
                        .SendAsync("ReceiveDeposit", new TransactionDto
                        {
                            Amount = order.Amount,
                            Id = order.OrderCode,
                            Fees = order.AmountWithFees - order.Amount,
                            Type = "deposit",
                            When = order.CreatedAt,
                        });

                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");
            }
        }

    }
}
