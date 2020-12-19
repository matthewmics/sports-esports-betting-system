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
using System.Threading.Tasks;

namespace Application.User
{
    public class Register
    {

        public class Command : IRequest<UserDto>
        {
            public string Email { get; set; }
            public string DisplayName { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, UserDto>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IMapper _mapper;

            public Handler(DataContext context, UserManager<AppUser> userManager, IMapper mapper)
            {
                _context = context;
                _userManager = userManager;
                _mapper = mapper;
            }

            public async Task<UserDto> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Email = "Email Already exists"});

                var userToCreate = new AppUser
                {
                    Email = request.Email,
                    DisplayName = request.DisplayName
                };

                var result = await _userManager.CreateAsync(userToCreate, request.Password);
                if (result.Succeeded)
                {
                    _context.Customers.Add(new Customer { AppUser = userToCreate });
                    await _context.SaveChangesAsync();
                    return _mapper.Map<UserDto>(userToCreate);
                }

                throw new Exception("Problem creating user");
            }
        }

    }
}
