using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Prediction.Dtos
{
    public class TeamPredictionEnvelope
    {
        public TeamPredictionDetailsDto TeamA { get; set; }
        public TeamPredictionDetailsDto TeamB { get; set; }
    }
}
