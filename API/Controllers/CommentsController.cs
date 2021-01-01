using Application.MatchComment.Dtos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/matches")]
    public class CommentsController : BaseController
    {

        [HttpGet("{matchId}/comments/recent")]
        public async Task<List<MatchCommentDto>> RecentComments(int matchId)
        {
            return await Mediator.Send(new Application.MatchComment.RecentComments.Query { MatchId = matchId });
        }

    }
}
