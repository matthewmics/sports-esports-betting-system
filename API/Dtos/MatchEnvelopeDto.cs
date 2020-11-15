using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class MatchEnvelopeDto
    {
        public List<MatchDto> Matches { get; set; }
        public int MatchCount { get; set; }
    }
}
