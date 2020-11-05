using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class PredictorDto
    {
        public string TeamName { get; set; }
        public decimal Amount { get; set; }
        public decimal PotentialWinning { get; set; }
    }
}
