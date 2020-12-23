using Application.Prediction.Dtos;
using Application.Team.Dtos;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Match.Dtos
{
    public class MatchDto
    {
        public int Id { get; set; }
        public string EventName { get; set; }
        public DateTime StartDate { get; set; }
        public PredictionStatus MatchStatus { get; set; }

        public Game Game { get; set; }

        public TeamDto TeamA { get; set; }
        public TeamDto TeamB { get; set; }
        public TeamDto Winner { get; set; }

        public int Series { get; set; }

        public ICollection<PredictionDto> Predictions { get; set; }


    }
}
