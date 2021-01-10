using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Wagerers.Dtos
{
    public class WagererDto
    {
        public string Photo { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public bool Banned { get; set; }
        public string Id { get; set; }
    }
}
