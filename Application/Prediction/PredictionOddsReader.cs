using Application.Prediction.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Application.Prediction
{
    public class PredictionOddsReader : IPredictionOddsReader
    {
        private readonly int _baseline = 1_000;
        private readonly decimal _commission = 0.05m;

        public TeamPredictionEnvelope ReadOdds(Domain.Prediction prediction)
        {
            var teamATotal = prediction.Predictors.Where(x => x.TeamId == prediction.Match.TeamAId)
                                .Select(x => x.Amount).Sum()
                                +
                                _baseline;
            var teamBTotal = prediction.Predictors.Where(x => x.TeamId == prediction.Match.TeamBId)
                                .Select(x => x.Amount).Sum()
                                +
                                _baseline;

            var teamAOdds = teamBTotal / teamATotal;
            var teamBOdds = teamATotal / teamBTotal;

            short teamAPercentage;
            short teamBPercentage;

            if (teamBOdds < teamAOdds)
            {
                teamAPercentage = (short)Math.Floor(((teamBOdds / 2) * 100));
                teamBPercentage = (short)(100 - teamAPercentage);
            }
            else
            {
                teamBPercentage = (short)Math.Floor(((teamAOdds / 2) * 100));
                teamAPercentage = (short)(100 - teamBPercentage);
            }

            teamAOdds = Math.Round(teamAOdds + 1 - _commission, 2);
            teamBOdds = Math.Round(teamBOdds + 1 - _commission, 2);

            return new TeamPredictionEnvelope
            {
                TeamA = new TeamPredictionDetailsDto
                {
                    Odds = teamAOdds,
                    Percentage = teamAPercentage
                },
                TeamB = new TeamPredictionDetailsDto
                {
                    Odds = teamBOdds,
                    Percentage = teamBPercentage
                }
            };

        }
    }
}
