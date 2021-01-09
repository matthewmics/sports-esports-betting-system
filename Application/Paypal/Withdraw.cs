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
using Application.Profile.Dtos;
using Application.Wagerers;

namespace Application.Paypal
{
    public class Withdraw
    {

        public class Command : IRequest<TransactionDto>
        {
            public string Email { get; set; }
            public int Amount { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Amount).NotEmpty().GreaterThanOrEqualTo(500).WithMessage("Minimum withdraw is 500");
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
            }
        }

        public class Handler : IRequestHandler<Command, TransactionDto>
        {
            private readonly DataContext _context;
            private readonly IPaypalAccessor _paypal;
            private readonly IUserAccessor _userAccessor;
            private readonly IWalletReader _walletReader;

            public Handler(DataContext context, IPaypalAccessor paypal, IUserAccessor useraccessor,
                IWalletReader walletReader)
            {
                _context = context;
                _paypal = paypal;
                _userAccessor = useraccessor;
                _walletReader = walletReader;
            }

            public async Task<TransactionDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var wagerer = await _context.Wagerers.SingleOrDefaultAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Not found" });

                decimal amount = request.Amount.AddPaypalWithdrawFees();

                if (_walletReader.ReadWallet(wagerer) < amount)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Wallet = "Not enough credits" });

                var result = _paypal.CreatePayout(request.Amount, request.Email);
                var paypalPayout = new Domain.PaypalPayout
                {
                     BatchId = result.BatchId,
                     CreatedAt = DateTime.Now,
                     Wagerer = wagerer,
                     DeductedAmount = amount,
                     RequestedAmount = request.Amount
                };

                _context.PaypalPayouts.Add(paypalPayout);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return new TransactionDto
                    {
                        Amount = request.Amount,
                        Fees = amount - request.Amount,
                        Id = result.BatchId,
                        When = DateTime.Now,
                        Type = "withdraw",
                    };

                throw new Exception("Problem saving changes");
            }
        }

    }
}
