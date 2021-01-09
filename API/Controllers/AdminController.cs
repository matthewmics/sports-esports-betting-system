using Application.AdminDashboard;
using Application.AdminDashboard.Dtos;
using Application.User;
using Application.User.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize(Policy = "IsAdmin")]
    public class AdminController : BaseController
    {
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<AdminDto> AdminLogin(AdminLogin.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet]
        public async Task<AdminDto> CurrentAdminUser()
        {
            return await Mediator.Send(new GetCurrentAdmin.Query());
        }

        [HttpGet("dashboard")]
        public async Task<AdminDashboardDto> Get()
        {
            return await Mediator.Send(new Get.Query());
        }
    }
}
