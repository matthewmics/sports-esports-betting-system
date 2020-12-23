using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Prediction.Dtos
{
    public class PredictionDetailsDto
    {
        public ActivePredictionDto ActivePrediction { get; set; }
        public PredictionDto Prediction { get; set; }
    }
}
