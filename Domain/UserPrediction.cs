using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserPrediction
    {
        public Wagerer Wagerer { get; set; }
        public string WagererId { get; set; }
        public Prediction Prediction { get; set; }
        public int PredictionId { get; set; }
        public Team Team { get; set; }
        public int TeamId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PredictedAt { get; set; }
    }
}
