using Application.Profile;
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
        public async Task<UserPredictionEnvelope> GetPredictionList([FromQuery] ListPredictions.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("predictionStats")]
        public async Task<PredictionStatsDto> GetProfileDetails([FromQuery] PredictionStats.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("changePhoto")]
        public async Task<ChangePhotoDto> UploadPhoto([FromForm] ChangePhoto.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("transactions")]
        public async Task<ListTransactions.TransactionEnvelope> GetTransactionList([FromQuery] ListTransactions.Query query)
        {
            return await Mediator.Send(query);
        }
    }
}
