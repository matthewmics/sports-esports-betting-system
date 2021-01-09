using Application.Prediction;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;

namespace Application.AdminDashboard
{
    public class ProfitReader : IProfitReader
    {
        private readonly IPredictionOutcomeReader _outcomeReader;

        public ProfitReader(IPredictionOutcomeReader outcomeReader)
        {
            _outcomeReader = outcomeReader;
        }

        public decimal Read(Domain.Prediction prediction)
        {
            var totalAmountPlaced = prediction.Predictors.Select(x => x.Amount).Sum();

            var totalWinningOutcome = prediction.Predictors.Where(x => x.TeamId == prediction.WinnerId)
                .Select(x => _outcomeReader.Read(x))
                .Sum();

            return totalAmountPlaced - totalWinningOutcome;
        }
    }
}
