using API.Data;
using API.Dtos;
using API.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.DataHelpers
{
    public class WalletResolver : IValueResolver<AppUser, UserDto, decimal>
    {
        private readonly DataContext _ctx;

        public WalletResolver(DataContext dataContext)
        {
            _ctx = dataContext;
        }

        public decimal Resolve(AppUser source, UserDto destination, decimal destMember, ResolutionContext context)
        {
            var customer = _ctx.Customers.SingleAsync(x => x.AppUserId == source.Id).Result;

            decimal transactionTotal = _ctx.UserTransactions
                                        .Where(x => x.CustomerId == customer.AppUserId)
                                        .AsEnumerable()
                                        .Sum(x => x.Amount);
            decimal predictionTotal = 0;

            return transactionTotal + predictionTotal;
        }
    }
}
