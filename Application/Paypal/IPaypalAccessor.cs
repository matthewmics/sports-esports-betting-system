using Application.Paypal.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Paypal
{
    public interface IPaypalAccessor
    {
        PaypalOrderDto CreateOrder(decimal amount);
        PaypalCaptureOrderDto CaptureOrder(string orderId);
        PaypalPayoutDto CreatePayout(decimal amount, string email);
    }
}
