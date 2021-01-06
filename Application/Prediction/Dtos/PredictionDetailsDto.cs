using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Prediction.Dtos
{
    public class PredictionDetailsDto
    {
        public ActivePredictionDto ActivePrediction { get; set; }
        public Domain.PredictionStatus PredictionStatus { get; set; }
        public TeamPredictionEnvelope TeamPredictionEnvelope { get; set; }
        public DateTime Schedule { get; set; }
    }
}
