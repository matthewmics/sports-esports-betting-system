using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.Logging;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Application.Team.Dtos;

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

        [Authorize(policy: "IsAdmin")]
        [HttpPost]
        public async Task<Unit> Create([FromForm] Application.Team.Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [Authorize(policy: "IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<Unit> Delete(int id)
        {
            return await Mediator.Send(new Application.Team.Delete.Command { TeamId = id });
        }

        [Authorize(policy: "IsAdmin")]
        [HttpPut("{id}")]
        public async Task<Unit> Edit(int id, [FromBody] Application.Team.Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [Authorize(policy: "IsAdmin")]
        [HttpPost("{id}/changeimage")]
        public async Task<Unit> ChangeImage(int id, [FromForm] Application.Team.ChangeImage.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }



    }
}
