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
                    var teamOdds = _oddsReader.ReadOdds(userPrediction.Prediction);

                    var selectedOdds = userPrediction.TeamId == userPrediction.Prediction.Match.TeamAId ? 
                        teamOdds.TeamA.Odds : 
                        teamOdds.TeamB.Odds;

                    return selectedOdds * userPrediction.Amount;
                }

                return -userPrediction.Amount;
            }

            return 0m;
        }
    }
}
