using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain
{
    public class WagererStats
    {
        [Required][Key]
        [ForeignKey("Wagerer")]
        public string WagererId { get; set; }
        public Wagerer Wagerer { get; set; }

        public int PredictionValue { get; set; }
        public int PredictionTotal { get; set; }

        public decimal MonthlyEarnings { get; set; }
        public decimal AllTimeEarnings { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
