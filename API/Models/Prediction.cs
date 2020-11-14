using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Prediction
    {
        public int Id { get; set; }

        public int Sequence { get; set; }

        public int MatchId { get; set; }
        public Match Match { get; set; }

        public short PredictionStatusId { get; set; }
        public PredictionStatus PredictionStatus { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public DateTime StartDate { get; set; }
        public ICollection<UserPrediction> Predictors { get; set; }
    }
}
