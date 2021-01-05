﻿using MediatR;
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
using Application.User;

namespace Application.Paypal
{
    public class Withdraw
    {

        public class Command : IRequest
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

        public class Handler : IRequestHandler<Command>
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var wagerer = await _context.Wagerers.SingleOrDefaultAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());
                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "Not found" });

                if (_walletReader.ReadWallet(wagerer) < (decimal)request.Amount)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Wallet = "Not enough credits" });

                decimal amount = Math.Round((decimal)request.Amount, 2);

                var result = _paypal.CreatePayout(amount, request.Email);
                var paypalPayout = new Domain.PaypalPayout
                {
                     BatchId = result.BatchId,
                     CreatedAt = DateTime.Now,
                     Wagerer = wagerer,
                     DeductedAmount = (amount + 12.5m),
                     RequestedAmount = amount
                };

                _context.PaypalPayouts.Add(paypalPayout);

                var success = await _context.SaveChangesAsync() > 0;

                if(success)
                    return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }

    }
}