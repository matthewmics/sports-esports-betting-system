using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profile.Dtos
{
    public class TransactionDto
    {
        public string Id { get; set; }
        public decimal Amount { get; set; }
        public decimal Fees { get; set; }
        public DateTime When { get; set; }
        public string Type { get; set; }
    }
}
