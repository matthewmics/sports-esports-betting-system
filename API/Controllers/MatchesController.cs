using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Match;

namespace API.Controllers
{
    public class MatchesController : BaseController
    {

        [HttpGet]
        public async Task<Application.Match.MatchEnvelope> List([FromQuery] Application.Match.List.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("{id}")]
        public async Task<MatchDto> Get([FromRoute] Application.Match.Get.Query query)
        {
            return await Mediator.Send(query);
        }


    }
}
