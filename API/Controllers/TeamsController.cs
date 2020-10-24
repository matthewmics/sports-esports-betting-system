using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class TeamsController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult> List()
        {
            var teams = await Context.Teams.ToListAsync();
            return Ok(teams);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var team = await Context.Teams.FindAsync(id);

            if (team == null)
                return NotFound("Team not found");

            return Ok(team);
        }

    }
}
