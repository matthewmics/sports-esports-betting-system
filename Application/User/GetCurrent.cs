using Application.Errors;
using Application.Interfaces;
using Application.User.Dtos;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Linq;

namespace Application.User
{
    public class GetCurrent
    {

        public class Query : IRequest<UserDto> { }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(IMapper mapper,
                DataContext context,
                IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async System.Threading.Tasks.Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var wagerer = await _context.Wagerers.Include(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.AppUser.Email == _userAccessor.GetCurrentEmail());

                if (wagerer == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Wagerer = "User not found" });

                if (wagerer.Banned)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Wagerer = "Account is banned" });

                wagerer.PredictionNotifications =
                        await _context.PredictionNotification
                        .Include(x => x.Prediction)
                            .ThenInclude(x => x.Match)
                                .ThenInclude(x => x.TeamA)
                        .Include(x => x.Prediction)
                            .ThenInclude(x => x.Match)
                                .ThenInclude(x => x.TeamB)
                        .Where(x => !x.Read && x.WagererId == wagerer.AppUserId).ToListAsync();

                return _mapper.Map<UserDto>(wagerer);
            }
        }

    }
}
