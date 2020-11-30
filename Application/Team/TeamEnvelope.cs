using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Team
{
    public class TeamEnvelope
    {
        public ICollection<TeamDto> Teams { get; set; }
        public int TeamCount { get; set; }
    }
}
