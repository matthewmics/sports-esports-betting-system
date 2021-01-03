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

            var ongoingPredictionValue = _ctx.UserPredictions
                                      .Where(x => x.WagererId == wagerer.AppUserId
                                        && (x.Prediction.PredictionStatusId == PredictionStatus.Open
                                        || x.Prediction.PredictionStatusId == PredictionStatus.Live))
                                      .Select(x => -x.Amount)
                                      .Sum();

            var paypalDepositTotal = _ctx.PaypalOrders
                                      .Where(x => x.WagererId == wagerer.AppUserId)
                                      .Select(x => x.Amount)
                                      .Sum();


            return 10000 + ongoingPredictionValue + paypalDepositTotal;
        }
    }
}
