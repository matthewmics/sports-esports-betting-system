using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Prediction.Dtos
{
    public class PredictionRequestDto
    {
        public decimal Amount { get; set; }
        public int TeamId { get; set; }
    }
}
