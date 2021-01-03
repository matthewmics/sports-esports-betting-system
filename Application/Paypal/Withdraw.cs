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
    public class Withdraw
    {

        public class Command : IRequest<PaypalPayoutDto>
        {
            public string Email { get; set; }
            public int Amount { get; set; }
        }

        public class Handler : IRequestHandler<Command, PaypalPayoutDto>
        {
            private readonly DataContext _context;
            private readonly IPaypalAccessor _paypal;

            public Handler(DataContext context, IPaypalAccessor paypal)
            {
                _context = context;
                _paypal = paypal;
            }

            public Task<PaypalPayoutDto> Handle(Command request, CancellationToken cancellationToken)
            {
                decimal amount = Math.Round((decimal)request.Amount, 2);
                var result = _paypal.CreatePayout(amount, request.Email);
                return Task.FromResult(result);
            }
        }

    }
}
