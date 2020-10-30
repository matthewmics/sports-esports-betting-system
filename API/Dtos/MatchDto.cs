using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class MatchDto
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string EventName { get; set; }
        public DateTime StartDate { get; set; }

        public TeamDto TeamA { get; set; }
        public TeamDto TeamB { get; set; }

        public ICollection<PredictionDto> Predictions { get; set; }


    }
}
