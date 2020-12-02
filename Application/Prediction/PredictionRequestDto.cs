using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Prediction
{
    public class PredictionRequestDto
    {
        public decimal Amount { get; set; }
        public int TeamId { get; set; }
    }
}
