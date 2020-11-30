using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Game
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public short Id { get; set; }
        public string Name { get; set; }
        public string DisplayText { get; set; }

        public const short Dota2 = 0;
        public const short Csgo = 1;
        public const short Sports = 2;
    }
}
