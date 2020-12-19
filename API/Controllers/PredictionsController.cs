﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using Application.Prediction.Dtos;
using System.Threading;
using System;

namespace API.Controllers
{
    public class PredictionsController : BaseController
    {
        private readonly static SemaphoreSlim _sempaphorePredict
            = new SemaphoreSlim(1);

        [HttpGet("{predictionId}/details")]
        public async Task<PredictionDetailsDto> PredictionDetails(int predictionId)
        {
            return await Mediator.Send(new Application.Prediction.Details.Query { PredictionId = predictionId });
        }

        [Authorize]
        [HttpPost("{predictionId}/predict")]
        public async Task<ActionResult<ActivePredictionDto>> Predict(int predictionId,
            [FromBody] Application.Prediction.Predict.Command command)
        {
            await _sempaphorePredict.WaitAsync();
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
        [HttpPut("{predictionId}/predict")]
        public async Task<ActionResult<ActivePredictionDto>> UpdatePrediction(int predictionId,
            [FromBody] Application.Prediction.UpdatePrediction.Command command)
        {
            await _sempaphorePredict.WaitAsync();
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
        [HttpDelete("{predictionId}/predict")]
        public async Task<Unit> Unpredict(int predictionId)
        {
            return await Mediator.Send(new Application.Prediction.Unpredict.Command() { PredictionId = predictionId });
        }

        [Authorize(policy: "IsAdmin")]
        [HttpPost("{predictionId}/setLive")]
        public async Task<Unit> SetLive(int predictionId)
        {
            return await Mediator.Send(new Application.Prediction.SetLive.Command() { PredictionId = predictionId});
        }


    }
}