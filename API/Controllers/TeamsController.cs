using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Dtos;
using AutoMapper;

namespace API.Controllers
{
    public class TeamsController : BaseController
    {
        private readonly IMapper _mapper;

        public TeamsController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> List(int? limit, int? offset)
        {
            var queryable = Context.Teams;

            var teams = await queryable.Skip(offset ?? 0).Take(limit ?? 3).ToListAsync();

            var teamEnvelope = new TeamEnvelope
            {
                Teams = _mapper.Map<ICollection<TeamDto>>(teams),
                TeamCount = await queryable.CountAsync(),
            };

            return Ok(teamEnvelope);
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
