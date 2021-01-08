using Application.Team.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Match.Dtos
{
    public class MatchRecentDto
    {
        public TeamDto TeamA { get; set; }
        public TeamDto TeamB { get; set; }
        public TeamDto Winner { get; set; }
        public int Id { get; set; }
        public DateTime SettledDate { get; set; }
    }
}
