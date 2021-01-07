using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profile.Dtos
{
    public class PredictionStatsDto
    {
        public int PredictionValue { get; set; }
        public int PredictionTotal { get; set; }

        public decimal MonthlyEarnings { get; set; }
        public decimal AllTimeEarnings { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
