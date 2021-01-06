using Application.Team.Dtos;
using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profile.Dtos
{
    public class UserPredictionDto
    {
        public UserPredictionTeamDto TeamA { get; set; }
        public UserPredictionTeamDto TeamB { get; set; }
        public string PredictionTitle { get; set; }
        public int PredictionId { get; set; }
        public int MatchId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PredictedAt { get; set; }
        public Domain.Game Game { get; set; }
        public decimal Outcome { get; set; }
        public PredictionStatus PredictionStatus { get; set; }
    }
}
