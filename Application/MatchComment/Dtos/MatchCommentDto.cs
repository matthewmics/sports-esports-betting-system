using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MatchComment.Dtos
{
    public class MatchCommentDto
    {
        public Guid Id { get; set; }

        public string DisplayName { get; set; }
        public string Message { get; set; }
        public string Photo { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
