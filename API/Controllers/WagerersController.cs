using Application.Wagerers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
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

        [HttpPost("{id}/ban")]
        public async Task<Unit> Ban(string id)
        {
            return await Mediator.Send(new Ban.Command { Id = id });
        }

        [HttpPost("{id}/unban")]
        public async Task<Unit> Unban(string id)
        {
            return await Mediator.Send(new Unban.Command { Id = id });
        }

    }
}
