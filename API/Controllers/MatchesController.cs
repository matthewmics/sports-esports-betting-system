using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Match.Dtos;
using Microsoft.AspNetCore.Authorization;
using MediatR;

namespace API.Controllers
{
    public class MatchesController : BaseController
    {

        [HttpGet]
        public async Task<MatchEnvelope> List([FromQuery] Application.Match.List.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost]
        [Authorize(Policy = "IsAdmin")]
        public async Task<MatchDto> Create([FromBody] Application.Match.Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{id}")]
        public async Task<MatchDto> Get([FromRoute] Application.Match.Get.Query query)
        {
            return await Mediator.Send(query);
        }


    }
}
