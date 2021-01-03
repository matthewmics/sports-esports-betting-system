using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Paypal.Dtos
{
    public class PaypalOrderDto
    {
        public string CheckoutLink { get; set; }
        public string OrderId { get; set; }
    }
}
