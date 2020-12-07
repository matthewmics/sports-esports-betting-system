using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Prediction.Dtos
{
    public class PredictionDto
    {
        public int Id { get; set; }
        public int Sequence { get; set; }
        public PredictionStatus PredictionStatus { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
    }
}
