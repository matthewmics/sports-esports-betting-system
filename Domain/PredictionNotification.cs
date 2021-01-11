using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain
{
    public class PredictionNotification
    {
        public int Id { get; set; }

        public Wagerer Wagerer { get; set; }

        [Required]
        public string WagererId { get; set; }

        public Prediction Prediction { get; set; }
        public int PredictionId { get; set; }

        public bool Read { get; set; }

        public decimal Outcome { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
