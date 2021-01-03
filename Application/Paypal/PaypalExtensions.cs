using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Paypal
{
    public static class PaypalExtensions
    {
        public static decimal AddPaypalFees(this int amount)
        {
            var totalFees = (amount + 15 + (amount * 0.029m)) - amount;
            totalFees += (totalFees * 0.029m);
            var result = amount + totalFees;
            return Math.Round(result, 2);
        }
    }
}
