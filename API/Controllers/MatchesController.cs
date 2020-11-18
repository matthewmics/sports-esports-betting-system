using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
    public class MatchesController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public MatchesController(IMapper mapper, IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<ActionResult> List([FromQuery] int? offset, [FromQuery] int? limit, [FromQuery] string game)
        {
            var queryable = Context.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .Include(x => x.Game)
                .OrderBy(x => x.StartDate)
                .AsQueryable();

            if(game != null && game != "all")
            {
                switch (game)
                {
                    case "dota2":
                        queryable = queryable.Where(x => x.GameId == Game.Dota2);
                        break;
                    case "csgo":
                        queryable = queryable.Where(x => x.GameId == Game.Csgo);
                        break;
                    case "sports":
                        queryable = queryable.Where(x => x.GameId == Game.Sports);
                        break;
                }
            }

            var matches = await queryable.Skip(offset ?? 0).Take(limit ?? 10).ToListAsync();

            var matchEnvelope = new MatchEnvelopeDto
            {
                Matches = _mapper.Map<List<MatchDto>>(matches),
                MatchCount = queryable.Count()
            };

            return Ok(matchEnvelope);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var match = await Context.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .Include(x => x.Game)
                .SingleOrDefaultAsync(x => x.Id == id);

            if (match == null)
                return NotFound(new { error = "match not found" });

            var matchToReturn = _mapper.Map<MatchDto>(match);

            return Ok(matchToReturn);
        }


    }
}
