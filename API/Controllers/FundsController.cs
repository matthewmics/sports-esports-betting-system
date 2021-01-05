using Application.Paypal;
using Application.Paypal.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace API.Controllers
{
    [Authorize]
    public class FundsController : BaseController
    {

        public class WebhookData
        {
            [JsonPropertyName("event_type")]
            public string EventType { get; set; }

            public WebhookDataResource Resource { get; set; }

            public class WebhookDataResource
            {
                public string Id { get; set; }
            }
        }

        [AllowAnonymous]
        [HttpPost("paypal/webhook")]
        public async Task<MediatR.Unit> PaypalWebhook([FromBody] WebhookData data)
        {
            switch (data.EventType)
            {
                case "CHECKOUT.ORDER.APPROVED":
                    var command = new CaptureDeposit.Command { OrderId = data.Resource.Id };
                    return await Mediator.Send(command);
                default:
                    throw new Exception("Problem processing paypal webhook");
            }

        }

        [HttpPost("paypal/captureDeposit")]
        public async Task<MediatR.Unit> PaypalCaptureDeposit([FromBody] CaptureDeposit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("paypal/deposit")]
        public async Task<PaypalOrderDto> PaypalDeposit([FromBody] Deposit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("paypal/withdraw")]
        public async Task<MediatR.Unit> PaypalWithdraw([FromBody] Withdraw.Command command)
        {
            return await Mediator.Send(command);
        }


    }
}
