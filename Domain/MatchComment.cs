using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain
{
    public class MatchComment
    {
        public Guid Id { get; set; }

        public string Message { get; set; }
        public Wagerer Wagerer { get; set; }

        [Required]
        public string WagererId { get; set; }

        public Match Match { get; set; }
        public int MatchId { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
