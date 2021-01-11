using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Prediction.Dtos
{
    public class PredictionNotificationDto
    {
        public decimal Outcome { get; set; }
        public DateTime When { get; set; }
        public int Id { get; set; }
        public int PredictionId { get; set; }
        public int MatchId { get; set; }
        public string MatchPredictionName { get; set; }
    }
}
