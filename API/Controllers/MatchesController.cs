using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using API.Dtos;

namespace API.Controllers
{
    public class MatchesController : BaseController
    {
        private readonly IMapper _mapper;

        public MatchesController(IMapper mapper)
        {
            _mapper = mapper;
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

    }
}
