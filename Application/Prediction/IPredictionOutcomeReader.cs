using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Prediction
{
    public interface IPredictionOutcomeReader
    {
        decimal Read(Domain.UserPrediction userPrediction);
    }
}
