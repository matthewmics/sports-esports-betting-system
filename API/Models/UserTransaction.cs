using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class UserTransaction
    {
        public int Id { get; set; }

        public Customer Customer { get; set; }

        public string CustomerId { get; set; }

        public UserTransactionType UserTransactionType { get; set; }

        public short UserTransactionTypeId { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal Amount { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
