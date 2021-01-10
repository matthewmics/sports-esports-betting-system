using Application.Wagerers.Dtos;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Application.Errors;

namespace Application.Hubs
{
    public class MainHub : Hub
    {

        private readonly static Dictionary<string, WagererDto> _onlineUsers = new Dictionary<string, WagererDto>();
        private readonly IMediator _mediatr;
        private readonly DataContext _ctx;

        public MainHub(IMediator mediatr, DataContext ctx)
        {
            _mediatr = mediatr;
            _ctx = ctx;
        }

        public override async Task OnConnectedAsync()
        {
            var uId = Context.UserIdentifier;
            var connId = Context.ConnectionId;

            try
            {

                var wagerer = await _mediatr.Send(new Application.Wagerers.Get.Query { Email = uId });

                _onlineUsers.Add(connId, wagerer);

                await Clients.Users(_ctx.Admins.Include(x => x.AppUser).Select(x => x.AppUser.Email).ToList())
                    .SendAsync("UserConnect", new { connId, wagerer });

            }
            catch (RestException)
            {
                // RestException -> user is not a wagerer
            }

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connId = Context.ConnectionId;

            _onlineUsers.Remove(connId);

            await Clients.Users(_ctx.Admins.Include(x => x.AppUser).Select(x => x.AppUser.Email).ToList())
                .SendAsync("UserDisconnect", connId);
        }

        [Authorize(policy: "IsAdmin")]
        public async Task GetOnlineUsers(string adminEmail)
        {
            await Clients.User(adminEmail).SendAsync("UsersFetched", _onlineUsers);
        }

    }
}
