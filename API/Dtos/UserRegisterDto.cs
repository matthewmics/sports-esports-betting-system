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
        [StringLength(30, MinimumLength = 6)]
        public string Username { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Invalid Name")]
        public string DisplayName { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 6)]
        [RegularExpression(@".*[A-Z].*", ErrorMessage = "Password must contain an Uppercase Letter")]
        public string Password { get; set; }
    }
}
