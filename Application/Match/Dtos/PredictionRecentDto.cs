using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Match.Dtos
{
    public class PredictionRecentDto
    {
        public string UserPhoto { get; set; }
        public string PredictionName { get; set; }
        public decimal Amount { get; set; }
        public DateTime When { get; set; }
    }
}
