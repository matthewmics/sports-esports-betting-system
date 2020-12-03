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
    public class GetCurrentAdmin
    {

        public class Query : IRequest<AdminDto>
        {

        }

        public class Handler : IRequestHandler<Query, AdminDto>
        {
            private readonly IMapper _mapper;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;

            public Handler(IMapper mapper, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                this._userManager = userManager;
                this._userAccessor = userAccessor;
            }

            public async System.Threading.Tasks.Task<AdminDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
                if (user == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound);
                return _mapper.Map<AdminDto>(user);
            }
        }

    }
}
