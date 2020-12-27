using Application.Errors;
using Application.Interfaces;
using Application.User.Dtos;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
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
            private readonly DataContext _context;

            public Handler(IMapper mapper, UserManager<AppUser> userManager, IUserAccessor userAccessor,
                DataContext context)
            {
                _mapper = mapper;
                _userManager = userManager;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async System.Threading.Tasks.Task<AdminDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(_userAccessor.GetCurrentEmail());
                if (!_context.Admins.Any(x => x.AppUserId == user.Id))
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);
                if (user == null)
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);
                return _mapper.Map<AdminDto>(user);
            }
        }

    }
}
