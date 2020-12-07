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
    public class AdminLogin
    {

        public class Query : IRequest<AdminDto>
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

        public class Handler : IRequestHandler<Query, AdminDto>
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
                _signInManager = signInManager;
            }

            public async System.Threading.Tasks.Task<AdminDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInDb = await _userManager.FindByEmailAsync(request.Email);

                if (
                    userInDb == null ||
                    !(await _ctx.Admins.AnyAsync(x => x.AppUserId == userInDb.Id))
                   )
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);

                var result = await _signInManager.CheckPasswordSignInAsync(userInDb, request.Password, false);

                if (result.Succeeded)
                {
                    return _mapper.Map<AdminDto>(userInDb);
                }

                throw new RestException(System.Net.HttpStatusCode.Unauthorized);
            }
        }

    }
}
