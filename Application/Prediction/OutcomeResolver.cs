using System;
using System.Collections.Generic;
using System.Text;
using Application.Prediction.Dtos;
using AutoMapper;
using Domain;

namespace Application.Prediction
{
    public class OutcomeResolver<T> : IValueResolver<Domain.UserPrediction, T, decimal>
    {
        private readonly IPredictionOddsReader _oddsReader;

        public OutcomeResolver(IPredictionOddsReader oddsReader)
        {
            _oddsReader = oddsReader;
        }

        public decimal Resolve(UserPrediction source, T destination, decimal destMember, ResolutionContext context)
        {
            if(source.Prediction.PredictionStatusId == Domain.PredictionStatus.Settled)
            {
                if(source.Prediction.WinnerId == source.TeamId)
                {
                    var teamOdds = _oddsReader.ReadOdds(source.Prediction);
                    var selectedOdds = source.TeamId == source.Prediction.Match.TeamAId ? teamOdds.TeamA.Odds : teamOdds.TeamB.Odds;
                    return selectedOdds * source.Amount;
                }

                return -source.Amount;
            }

            return 0m;
        }
    }
}
