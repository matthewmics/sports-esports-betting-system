using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Prediction
{
    public class PredictionOutcomeReader : IPredictionOutcomeReader
    {
        private readonly IPredictionOddsReader _oddsReader;

        public PredictionOutcomeReader(IPredictionOddsReader oddsReader)
        {
            this._oddsReader = oddsReader;
        }

        public decimal Read(UserPrediction userPrediction)
        {
            if (userPrediction.Prediction.PredictionStatusId == Domain.PredictionStatus.Settled)
            {
                if (userPrediction.Prediction.WinnerId == userPrediction.TeamId)
                {
                    return userPrediction.Prediction.WinningOdds * userPrediction.Amount;
                }

                return -userPrediction.Amount;
            }

            return 0m;
        }
    }
}
