using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
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

            public Query()
            {

            }

        }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly IMapper _mapper;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;

            public Handler(IMapper mapper, UserManager<AppUser> userManager,
                IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _userManager = userManager;
                _userAccessor = userAccessor;
            }

            public async System.Threading.Tasks.Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
                if (user == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound);
                return _mapper.Map<UserDto>(user);
            }
        }

    }
}
