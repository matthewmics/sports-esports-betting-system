﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using Application.Prediction.Dtos;
using System.Threading;
using System;

namespace API.Controllers
{
    [Route("api/matches")]
    public class PredictionController : BaseController
    {
        private readonly static SemaphoreSlim _sempaphorePredict
            = new SemaphoreSlim(1);

        [HttpGet("{matchId}/predictions/{predictionId}/details")]
        public async Task<PredictionDetailsDto> PredictionDetails(int matchId, int predictionId)
        {
            return await Mediator.Send(new Application.Prediction.Details.Query { MatchId = matchId, PredictionId = predictionId });
        }

        [Authorize]
        [HttpPost("{matchId}/predictions/{predictionId}/predict")]
        public async Task<ActionResult<ActivePredictionDto>> Predict(int matchId, int predictionId,
            [FromBody] Application.Prediction.Predict.Command command)
        {
            await _sempaphorePredict.WaitAsync();
            command.MatchId = matchId;
            command.PredictionId = predictionId;
            try
            {
                var result = await Mediator.Send(command);
                _sempaphorePredict.Release();
                return result;
            }
            catch (Exception err)
            {
                _sempaphorePredict.Release();
                throw err;
            }
        }

        [Authorize]
        [HttpPut("{matchId}/predictions/{predictionId}/predict")]
        public async Task<ActionResult<ActivePredictionDto>> UpdatePrediction(int matchId, int predictionId,
            [FromBody] Application.Prediction.Predict.Command command)
        {
            command.MatchId = matchId;
            command.PredictionId = predictionId;
            return await Mediator.Send(command);
        }

        [Authorize]
        [HttpDelete("{matchId}/predictions/{predictionId}/predict")]
        public async Task<Unit> Unpredict(int matchId, int predictionId)
        {
            var command = new Application.Prediction.Unpredict.Command
            {
                MatchId = matchId,
                PredictionId = predictionId
            };
            return await Mediator.Send(command);
        }
    }
}
