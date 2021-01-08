using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Match.Dtos;
using Microsoft.AspNetCore.Authorization;
using Application.Match;

namespace API.Controllers
{
    public class MatchesController : BaseController
    {

        [HttpGet]
        public async Task<MatchEnvelope> List([FromQuery] List.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost]
        [Authorize(Policy = "IsAdmin")]
        public async Task<MatchDto> Create([FromBody] Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{id}")]
        public async Task<MatchDto> Get([FromRoute] Get.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("recent")]
        public async Task<System.Collections.Generic.List<MatchRecentDto>> Recent([FromQuery] Recent.Query query)
        {
            return await Mediator.Send(query);
        }


    }
}
