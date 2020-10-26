using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class UserRegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        public string DisplayName { get; set; }

        [Required]
        [MinLength(6)]
        [RegularExpression(@".*[A-Z].*", ErrorMessage = "Password must contain an Uppercase Letter")]
        public string Password { get; set; }
    }
}
