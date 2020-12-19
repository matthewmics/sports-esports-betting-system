using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class PredictionStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public short Id { get; set; }
        public string Name { get; set; }
        public string DisplayText { get; set; }

        public const short Open = 0;
        public const short Settled = 1;
        public const short Cancelled = 2;
        public const short Live = 3;
    }
}
