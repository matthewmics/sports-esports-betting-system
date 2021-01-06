using Application.Prediction.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Prediction
{
    public interface IPredictionOddsReader
    {
        TeamPredictionEnvelope ReadOdds(Domain.Prediction prediction);
    }
}
