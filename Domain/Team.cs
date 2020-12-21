using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Match> TeamAMatches { get; set; }
        public ICollection<Match> TeamBMatches { get; set; }
        public ICollection<Prediction> WinningPredictions { get; set; }
    }
}
