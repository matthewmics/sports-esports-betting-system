using Application.Prediction.Dtos;
using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Prediction
{
    public class PotentialRewardResolver : IValueResolver<Domain.UserPrediction, ActivePredictionDto, decimal>
    {
        private readonly IPredictionOddsReader _oddsReader;

        public PotentialRewardResolver(IPredictionOddsReader oddsReader)
        {
            _oddsReader = oddsReader;
        }

        public decimal Resolve(UserPrediction source, ActivePredictionDto destination, decimal destMember, ResolutionContext context)
        {
            var data = _oddsReader.ReadOdds(source.Prediction);

            var odds = source.TeamId == source.Prediction.Match.TeamAId ? data.TeamA.Odds : data.TeamB.Odds;

            return source.Amount * odds;
        }
    }
}
