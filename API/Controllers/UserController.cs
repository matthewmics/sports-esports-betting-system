using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using Microsoft.Extensions.Configuration;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;

        public UserController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, IUserAccessor userAccessor,
            IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> CurrentUser()
        {
            var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(UserRegisterDto user)
        {
            if (await Context.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest(new { error = "Email already exists" });
            if (await Context.Users.AnyAsync(u => u.UserName == user.Username))
                return BadRequest(new { error = "Username already exists" });

            var userToCreate = new AppUser
            {
                UserName = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName
            };

            var result = await _userManager.CreateAsync(userToCreate, user.Password);
            if (result.Succeeded)
            {
                return Ok(_mapper.Map<UserDto>(userToCreate));
            }

            throw new Exception("Problem creating user");
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody]UserLoginDto user)
        {
            var userInDb = await _userManager.FindByEmailAsync(user.Email);

            if (userInDb == null)
                return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(userInDb, user.Password, false);

            if (result.Succeeded)
            {
                return Ok(_mapper.Map<UserDto>(userInDb));
            }

            return Unauthorized("Invalid email or password");
        }
    }
}
