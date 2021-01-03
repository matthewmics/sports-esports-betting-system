using Application.Paypal;
using Application.Paypal.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class FundsController : BaseController
    {
        [HttpPost("paypal/deposit")]
        public async Task<PaypalOrderDto> PaypalDeposit([FromBody] Deposit.Command command)
        {
            return await Mediator.Send(command);
        }


        [HttpPost("paypal/captureDeposit")]
        public async Task<MediatR.Unit> PaypalCaptureDeposit([FromBody] CaptureDeposit.Command command)
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
