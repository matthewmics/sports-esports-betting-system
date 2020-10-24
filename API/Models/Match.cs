using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Match
    {
        public int Id { get; set; }

        public string Category { get; set; }
        public string EventName { get; set; }

        public DateTime StartDate { get; set; }

        public Team TeamA { get; set; }
        public int TeamAId { get; set; }

        public Team TeamB { get; set; }
        public int TeamBId { get; set; }
    }
}
