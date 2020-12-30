using Microsoft.AspNetCore.Authorization;
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
            await SemaphorePredict.WaitAsync();
            command.PredictionId = predictionId;
            try
            {
                var result = await Mediator.Send(command);
                SemaphorePredict.Release();
                return result;
            }
            catch (Exception err)
            {
                SemaphorePredict.Release();
                throw err;
            }
        }

        [Authorize]
        [HttpPut("{predictionId}/predict")]
        public async Task<ActionResult<ActivePredictionDto>> UpdatePrediction(int predictionId,
            [FromBody] Application.Prediction.UpdatePrediction.Command command)
        {
            await SemaphorePredict.WaitAsync();
            command.PredictionId = predictionId;
            try
            {
                var result = await Mediator.Send(command);
                SemaphorePredict.Release();
                return result;
            }
            catch (Exception err)
            {
                SemaphorePredict.Release();
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

        [Authorize(policy: "IsAdmin")]
        [HttpPost("{predictionId}/reschedule")]
        public async Task<Unit> Reschedule(int predictionId, [FromBody] Application.Prediction.Reschedule.Command command)
        {
            command.PredictionId = predictionId;
            return await Mediator.Send(command);
        }

        [Authorize(policy: "IsAdmin")]
        [HttpPost("{predictionId}/settle")]
        public async Task<Unit> Settle(int predictionId, [FromBody] Application.Prediction.Settle.Command command)
        {
            command.PredictionId = predictionId;
            return await Mediator.Send(command);
        }

        [Authorize(policy: "IsAdmin")]
        [HttpPost("{predictionId}/cancel")]
        public async Task<Unit> Cancel(int predictionId)
        {
            return await Mediator.Send(new Application.Prediction.Cancel.Command { PredictionId = predictionId});
        }

        [Authorize(policy: "IsAdmin")]
        [HttpPost]
        public async Task<PredictionDto> Create([FromBody] Application.Prediction.Create.Command command)
        {
            return await Mediator.Send(command);
        }

    }
}
