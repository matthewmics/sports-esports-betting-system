using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Domain
{
    public class PaypalOrder
    {
        [Key]
        public string OrderCode { get; set; }

        public Wagerer Wagerer { get; set; }
        public string WagererId { get; set; }

        public decimal Amount { get; set; }
        public decimal AmountWithFees { get; set; }

        public bool IsCaptured { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? CapturedDate { get; set; }

    }
}
