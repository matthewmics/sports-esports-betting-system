using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.User.Dtos
{
    public class BaseUser
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
