using Application.Profile.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Application.Profile.ListPredictions;

namespace API.Controllers
{
    [Authorize]
    public class ProfileController : BaseController
    {
        [HttpGet("predictions")]
        public async Task<UserPredictionEnvelope> GetPredictionList([FromQuery] Application.Profile.ListPredictions.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("predictionStats")]
        public async Task<PredictionStatsDto> GetProfileDetails([FromQuery] Application.Profile.PredictionStats.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("changePhoto")]
        public async Task<ChangePhotoDto> UploadPhoto([FromForm] Application.Profile.ChangePhoto.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}
