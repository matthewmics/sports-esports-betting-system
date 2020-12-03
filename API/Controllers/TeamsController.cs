using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.Logging;
using Application.Team;
using MediatR;

namespace API.Controllers
{
    public class TeamsController : BaseController
    {

        [HttpGet]
        public async Task<TeamEnvelope> List([FromQuery] Application.Team.List.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("{id}")]
        public async Task<TeamDto> Get([FromRoute] Application.Team.Get.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost]
        public async Task<Unit> Create([FromForm] Application.Team.Create.Command command)
        {
            return await Mediator.Send(command);
        }

    }
}
