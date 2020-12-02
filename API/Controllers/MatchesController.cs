using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Match;

namespace API.Controllers
{
    public class MatchesController : BaseController
    {

        [HttpGet]
        public async Task<Application.Match.MatchEnvelope> List(int? offset, int? limit, string game)
        {
            return await Mediator.Send(new Application.Match.List.Query(limit, offset, game));
        }

        [HttpGet("{id}")]
        public async Task<MatchDto> Get(int id)
        {
            return await Mediator.Send(new Application.Match.Get.Query(id));
        }


    }
}
