using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
    }
}
