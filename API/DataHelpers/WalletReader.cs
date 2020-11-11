using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataHelpers
{
    public class WalletReader : IWalletReader
    {
        private readonly DataContext _ctx;

        public WalletReader(DataContext dataContext)
        {
            _ctx = dataContext;
        }

        public decimal ReadWallet(Customer customer)
        {
            decimal transactionTotal = _ctx.UserTransactions
                                        .Where(x => x.CustomerId == customer.AppUserId)
                                        .AsEnumerable()
                                        .Sum(x => x.UserTransactionTypeId == UserTransactionType.CashIn ? 
                                                  x.Amount : -x.Amount);

            decimal predictionTotal = _ctx.UserPredictions
                                      .Where(x => x.CustomerId == customer.AppUserId)
                                      .AsEnumerable()
                                      .Sum(x => x.Amount);

            return transactionTotal - predictionTotal;
        }
    }
}
