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

        public async Task<ActionResult> List()
        {
            var matches = await Context.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .ToListAsync();

            var matchesToReturn = _mapper.Map<ICollection<MatchDto>>(matches);

            return Ok(matchesToReturn);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var match = await Context.Matches
                .Include(x => x.TeamA)
                .Include(x => x.TeamB)
                .Include(x => x.Predictions)
                    .ThenInclude(x => x.PredictionStatus)
                .SingleOrDefaultAsync(x => x.Id == id);

            var matchToReturn = _mapper.Map<MatchDto>(match);

            return Ok(matchToReturn);
        }


    }
}
