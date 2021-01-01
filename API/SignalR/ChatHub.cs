using MediatR;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        private string GetEmail()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }

        public async Task SendComment(Application.MatchComment.Create.Command command)
        {
            var email = GetEmail();

            command.Email = email;
            
            var comment = await _mediator.Send(command);

            await Clients.Group("MatchGroup"+command.MatchId).SendAsync("ReceiveComment", comment);
        }

        public async Task AddToMatchGroup(int matchId)
        {
            var groupName = "MatchGroup" + matchId;
            await Groups.AddToGroupAsync(Context.ConnectionId,  groupName);
        }
    }
}
