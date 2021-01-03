using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Paypal.Dtos
{
    public class PaypalCaptureOrderDto
    {
        public string CaptureId { get; set; }
        public string Status { get; set; }
    }
}
