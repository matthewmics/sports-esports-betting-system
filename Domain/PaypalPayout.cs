using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain
{
    public class PaypalPayout
    {
        [Key]
        public string BatchId { get; set; }

        public Wagerer Wagerer { get; set; }
        public string WagererId { get; set; }

        public decimal RequestedAmount { get; set; }
        public decimal DeductedAmount { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
