using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Wagerer
    {
        [Required]
        [Key]
        [ForeignKey("AppUser")]
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public string ProfilePhoto { get; set; }

        public bool Banned { get; set; }

        public ICollection<UserPrediction> Predictions { get; set; }
    }
}
