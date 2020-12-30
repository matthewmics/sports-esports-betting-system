using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.User
{
    public class WalletReader : IWalletReader
    {
        private readonly DataContext _ctx;

        public WalletReader(DataContext dataContext)
        {
            _ctx = dataContext;
        }

        public decimal ReadWallet(Wagerer wagerer)
        {
            decimal predictionTotal = _ctx.UserPredictions
                                      .Where(x => x.WagererId == wagerer.AppUserId)
                                      .AsEnumerable()
                                      .Sum(x => x.Amount);

            return 10000 - predictionTotal;
        }
    }
}
