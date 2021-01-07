using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using Application.Profile.Dtos;
using AutoMapper;
using Application.Interfaces;
using System.Linq;

namespace Application.Profile
{
    public class ListTransactions
    {
        public class TransactionEnvelope
        {
            public List<TransactionDto> Transactions { get; set; }
            public int TransactionCount { get; set; }
        }

        public class Query : IRequest<TransactionEnvelope>
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        public class Handler : IRequestHandler<Query, TransactionEnvelope>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext ctx, IMapper mapper, IUserAccessor userAccessor)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<TransactionEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var wagerer = await _ctx.Wagerers
                    .SingleAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());

                var queryable = _ctx.PaypalOrders.Where(x => x.WagererId == wagerer.AppUserId)
                    .Select(x => new TransactionDto
                    {
                        Id = x.OrderCode,
                        Amount = x.Amount,
                        Fees = x.AmountWithFees - x.Amount,
                        Type = "deposit",
                        When = x.CreatedAt
                    })
                    .AsQueryable();

                queryable = _ctx.PaypalPayouts.Where(x => x.WagererId == wagerer.AppUserId)
                    .Select(x => new TransactionDto
                    {
                        Id = x.BatchId,
                        Amount = x.RequestedAmount,
                        Fees = 12.5m,
                        Type = "withdraw",
                        When = x.CreatedAt
                    })
                    .Union(queryable)
                    .OrderByDescending(x => x.When);

                var transactions = await queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 5).ToListAsync();

                return new TransactionEnvelope
                {
                    TransactionCount = await queryable.CountAsync(),
                    Transactions = transactions
                };
            }
        }

    }
}
