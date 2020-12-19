using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using Application.Prediction.Dtos;
using System.Threading;
using System;

namespace API.Controllers
{
    [Route("api/predictions")]
    public class PredictionController : BaseController
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
        public async Task<Unit> Unpredict(Application.Prediction.Unpredict.Command command)
        {
            return await Mediator.Send(command);
        }




    }
}
