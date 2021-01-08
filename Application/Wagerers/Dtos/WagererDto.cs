using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Wagerers.Dtos
{
    public class WagererDto
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public bool Blocked { get; set; }
        public string Id { get; set; }
    }
}
