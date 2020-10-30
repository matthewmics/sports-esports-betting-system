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

namespace API.Controllers
{
    public class UserController : BaseController
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IConfiguration _configuration;

        public UserController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager,
            IJwtTokenGenerator jwtTokenGenerator, IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(UserRegisterDto user)
        {
            if (await Context.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest("Email already exists");
            if (await Context.Users.AnyAsync(u => u.UserName == user.Username))
                return BadRequest("Username already exists");

            var userToCreate = new AppUser
            {
                UserName = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName
            };

            var result = await _userManager.CreateAsync(userToCreate, user.Password);
            if (result.Succeeded)
            {
                return Ok(new UserDto
                {
                    DisplayName = userToCreate.DisplayName,
                    Email = userToCreate.Email,
                    Username = userToCreate.UserName,
                    Token = _jwtTokenGenerator.GenerateToken(userToCreate.UserName,
                    _configuration.GetSection("AppSettings:TokenKey").Value)
                });
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
                return Ok(new UserDto
                {
                    DisplayName = userInDb.DisplayName,
                    Email = userInDb.Email,
                    Username = userInDb.UserName,
                    Token = _jwtTokenGenerator.GenerateToken(userInDb.UserName,
                    _configuration.GetSection("AppSettings:TokenKey").Value)
                });
            }

            return Unauthorized("Invalid email or password");
        }
    }
}
