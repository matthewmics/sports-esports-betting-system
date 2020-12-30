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

namespace Application.User
{
    public class GetCurrent
    {

        public class Query : IRequest<UserDto>
        {

        }

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
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);
                return _mapper.Map<UserDto>(wagerer);
            }
        }

    }
}
