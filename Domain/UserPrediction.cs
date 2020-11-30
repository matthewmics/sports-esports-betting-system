using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserPrediction
    {
        public Customer Customer { get; set; }
        public string CustomerId { get; set; }
        public Prediction Prediction { get; set; }
        public int PredictionId { get; set; }
        public Team Team { get; set; }
        public int TeamId { get; set; }
        public decimal Amount { get; set; }
    }
}
