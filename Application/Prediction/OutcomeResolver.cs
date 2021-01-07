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
        private readonly IPredictionOutcomeReader _outcomeReader;

        public OutcomeResolver(IPredictionOutcomeReader outcomeReader)
        {
            this._outcomeReader = outcomeReader;
        }

        public decimal Resolve(UserPrediction source, T destination, decimal destMember, ResolutionContext context)
        {
            return _outcomeReader.Read(source);
        }
    }
}
