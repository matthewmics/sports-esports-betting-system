using System;
using MediatR;
using Persistence;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Linq;
using Application.Wagerers.Dtos;

namespace Application.Wagerers
{
    public class ListWagerers
    {
        public class WagererEnvelope
        {
            public List<WagererDto> Wagerers { get; set; }

            public int WagererCount { get; set; }
        }

        public class Query : IRequest<WagererEnvelope>
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public string Q { get; set; } // Search term
            public string SortBy { get; set; }
            public string OrderBy { get; set; } // ASC or DESC
        }

        public class Handler : IRequestHandler<Query, WagererEnvelope>
        {
            private readonly DataContext _ctx;
            private readonly IMapper _mapper;

            public Handler(DataContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async Task<WagererEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                System.Linq.Expressions.Expression<Func<Domain.Wagerer, object>>
                    sortAs = request.SortBy switch
                    {
                        "status" => x => x.Banned,
                        "email" => x => x.AppUser.Email ,
                        _ => x => x.AppUser.DisplayName,
                    };

                var queryable = _ctx.Wagerers.Include(x => x.AppUser).AsQueryable();

                if (request.OrderBy == "desc")
                    queryable = queryable.OrderByDescending(sortAs);
                else
                    queryable = queryable.OrderBy(sortAs);

                if (!string.IsNullOrEmpty(request.Q))
                {
                    queryable = queryable.Where(x => x.AppUser.DisplayName.Contains(request.Q) ||
                    x.AppUser.Email.Contains(request.Q));
                }

                var wagerers = await queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToListAsync();

                return new WagererEnvelope
                {
                    WagererCount = await queryable.CountAsync(),
                    Wagerers = _mapper.Map<List<WagererDto>>(wagerers),
                };
            }
        }

    }
}
