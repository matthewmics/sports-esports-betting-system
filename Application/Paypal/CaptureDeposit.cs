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

namespace Application.Paypal
{
    public class CaptureDeposit
    {

        public class Command : IRequest<PaypalCaptureOrderDto>
        {
            public string OrderId { get; set; }
        }

        public class Handler : IRequestHandler<Command, PaypalCaptureOrderDto>
        {
            private readonly DataContext _context;
            private readonly IPaypalAccessor _paypalAccessor;

            public Handler(DataContext context, IPaypalAccessor paypalAccessor)
            {
                _context = context;
                _paypalAccessor = paypalAccessor;
            }

            public async Task<PaypalCaptureOrderDto> Handle(Command request, CancellationToken cancellationToken)
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
                    return result;

                throw new Exception("Problem saving changes");
            }
        }

    }
}
