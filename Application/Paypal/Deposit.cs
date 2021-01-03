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
using Application.Interfaces;
using FluentValidation;

namespace Application.Paypal
{
    public class Deposit
    {
        public class Command : IRequest<PaypalOrderDto>
        {
            public int Amount { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Amount).NotEmpty().GreaterThanOrEqualTo(500).WithMessage("Minimum deposit is 500");
            }
        }

        public class Handler : IRequestHandler<Command, PaypalOrderDto>
        {
            private readonly DataContext _context;
            private readonly IPaypalAccessor _paypal;
            private readonly IUserAccessor _useraccessor;

            public Handler(DataContext context, IPaypalAccessor paypal, IUserAccessor useraccessor)
            {
                _context = context;
                _paypal = paypal;
                _useraccessor = useraccessor;
            }

            public async Task<PaypalOrderDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var wagerer = await _context.Wagerers.SingleOrDefaultAsync(x => x.AppUser.Email == _useraccessor.GetCurrentEmail());
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Not found" });

                var amount = request.Amount.AddPaypalFees();
                var result = _paypal.CreateOrder(amount);

                var paypalOrder = new Domain.PaypalOrder
                {
                    Amount = request.Amount,
                    AmountWithFees = amount,
                    CreatedAt = DateTime.Now,
                    OrderCode = result.OrderId,
                    Wagerer = wagerer,                
                };

                _context.PaypalOrders.Add(paypalOrder);

                var success = await _context.SaveChangesAsync() > 0;

                if(success)
                    return result;

                throw new Exception("Problem creating order");
            }
        }

    }
}
