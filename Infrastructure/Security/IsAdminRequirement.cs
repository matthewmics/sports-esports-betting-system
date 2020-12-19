using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class IsAdminRequirement : IAuthorizationRequirement
    {

    }

    public class IsAdminRequirementHandler : AuthorizationHandler<IsAdminRequirement>
    {
        private readonly IHttpContextAccessor _httpContext;
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserAccessor _userAccessor;

        public IsAdminRequirementHandler(IHttpContextAccessor httpContext,
            DataContext context,
            UserManager<AppUser> userManager,
            IUserAccessor userAccessor)
        {
            _httpContext = httpContext;
            _context = context;
            _userManager = userManager;
            _userAccessor = userAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsAdminRequirement requirement)
        {
            var currentUser = _httpContext.HttpContext.User?.Claims?
                .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            var user = _userManager.FindByEmailAsync(_userAccessor.GetCurrentEmail()).Result;

            if (_context.Admins.Any(x => x.AppUserId == user.Id))
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
