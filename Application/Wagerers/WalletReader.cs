using Application.Prediction;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Wagerers
{
    public class WalletReader : IWalletReader
    {
        private readonly DataContext _ctx;
        private readonly IPredictionOutcomeReader _outcomeReader;

        public WalletReader(DataContext dataContext, IPredictionOutcomeReader outcomeReader)
        {
            _ctx = dataContext;
            _outcomeReader = outcomeReader;
        }

        public decimal ReadWallet(Wagerer wagerer)
        {
            var userPredictions = _ctx.UserPredictions
                                        .Include(x => x.Prediction)
                                            .ThenInclude(x => x.Match)
                                      .Where(x => x.WagererId == wagerer.AppUserId)
                                      .ToList();

            var predictionValue = userPredictions
                                      .Where(x => x.Prediction.PredictionStatusId != PredictionStatus.Cancelled)
                                      .Select(x => -x.Amount)
                                      .Sum();

            var outcomeValue = userPredictions
                .Where(x => x.Prediction.PredictionStatusId == PredictionStatus.Settled)
                .Select(x => _outcomeReader.Read(x)).Sum();

            var paypalDepositTotal = _ctx.PaypalOrders
                                      .Where(x => x.WagererId == wagerer.AppUserId && x.IsCaptured)
                                      .Select(x => x.Amount)
                                      .Sum();

            var paypalWithdrawTotal = _ctx.PaypalPayouts
                                      .Where(x => x.WagererId == wagerer.AppUserId)
                                      .Select(x => -x.DeductedAmount)
                                      .Sum();

            return predictionValue + paypalDepositTotal + paypalWithdrawTotal + outcomeValue;
        }
    }
}
