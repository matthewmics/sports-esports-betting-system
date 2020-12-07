using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Match.Dtos
{
    public class MatchEnvelope
    {
        public List<MatchDto> Matches { get; set; }
        public int MatchCount { get; set; }
    }
}
