using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.Logging;
using Domain;
using Application.Team;

namespace API.Controllers
{
    public class TeamsController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly ILogger<TeamsController> _logger;

        public TeamsController(IMapper mapper, ILogger<TeamsController> logger)
        {
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> List(int? limit, int? offset, string q, string sortBy, string orderBy)
        {
            System.Linq.Expressions.Expression<Func<Team, object>> 
                sortAs = sortBy switch
            {
                "createdAt" => x => x.CreatedAt,
                _ => x => x.Name,
            };

            var queryable = orderBy == "desc" ? 
                Context.Teams.OrderByDescending(sortAs).AsQueryable() : 
                Context.Teams.OrderBy(sortAs).AsQueryable();

            if (!string.IsNullOrEmpty(q))
            {
                queryable = queryable.Where(x => x.Name.Contains(q));
            }

            var teams = queryable.Skip(offset ?? 0).Take(limit ?? 3).ToList();

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


        [HttpPost]
        public async Task<ActionResult> Create(IFormFile file)
        {
            await UploadPhoto(file);

            return Ok();
        }

        private async Task<bool> UploadPhoto(IFormFile file)
        {
            bool isSaveSuccess = false;
            string fileName;
            try
            {
                var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1].ToLower();

                if(file.Length > 4_000_000 || (extension != ".png" && extension != ".jpg"))
                {
                    throw new Exception("Photos should be less than 4 MB and saved as JPG or PNG");
                }

                fileName = Guid.NewGuid().ToString("N") + extension;

                var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Uploads\\images");

                if (!Directory.Exists(pathBuilt))
                {
                    Directory.CreateDirectory(pathBuilt);
                }

                var path = Path.Combine(Directory.GetCurrentDirectory(), "Uploads\\images",
                   fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                isSaveSuccess = true;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
            }

            return isSaveSuccess;
        }
    }
}
