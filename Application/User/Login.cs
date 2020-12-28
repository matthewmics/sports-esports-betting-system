using Application.Errors;
using Application.User.Dtos;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace Application.User
{
    public class Login
    {

        public class Query : IRequest<UserDto>
        {
            public string Email { get; set; }
            public string Password { get; set; }

        }

        public class CommandValidator : AbstractValidator<Query>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;

            public Handler(DataContext ctx, IMapper mapper, UserManager<AppUser> userManager,
                SignInManager<AppUser> signInManager)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userManager = userManager;
                this._signInManager = signInManager;
            }

            public async System.Threading.Tasks.Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInDb = await _userManager.FindByEmailAsync(request.Email);

                if (
                    userInDb == null ||
                    !(await _ctx.Wagerers.AnyAsync(x => x.AppUserId == userInDb.Id))
                   )
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);

                var result = await _signInManager.CheckPasswordSignInAsync(userInDb, request.Password, false);

                if (result.Succeeded)
                {
                    return _mapper.Map<UserDto>(userInDb);
                }

                throw new RestException(System.Net.HttpStatusCode.Unauthorized);
            }
        }

    }
}
