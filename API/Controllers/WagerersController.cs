using Application.Wagerers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Application.Wagerers.ListWagerers;

namespace API.Controllers
{
    [Authorize(Policy = "IsAdmin")]
    public class WagerersController : BaseController
    {
        [HttpGet]
        public async Task<WagererEnvelope> List([FromQuery] ListWagerers.Query query)
        {
            return await Mediator.Send(query);
        }
    }
}
