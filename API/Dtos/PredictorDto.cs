using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class PredictorDto
    {
        public int CustomerId { get; set; }
        public string DisplayName { get; set; }
        public bool IsCurrentUser { get; set; }
        public decimal Amount { get; set; }
        public string TeamName { get; set; }
        public DateTime PredictedAt { get; set; }
    }
}
