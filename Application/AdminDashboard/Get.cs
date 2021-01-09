using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using Application.AdminDashboard.Dtos;
using System.Linq;

namespace Application.AdminDashboard
{
    public class Get
    {
        private static AdminDashboardDto AdminDashboardStats = null;

        public class Query : IRequest<AdminDashboardDto> { }

        public class Handler : IRequestHandler<Query, AdminDashboardDto>
        {
            private readonly DataContext _ctx;
            private readonly IProfitReader _profitReader;

            public Handler(DataContext ctx, IProfitReader profitReader)
            {
                _ctx = ctx;
                _profitReader = profitReader;
            }

            public async Task<AdminDashboardDto> Handle(Query request, CancellationToken cancellationToken)
            {

                if (AdminDashboardStats == null || AdminDashboardStats.LastUpdated.AddMinutes(10) < DateTime.Now)
                {
                    var predictions = await _ctx.Predictions.Include(x => x.Predictors)
                        .Include(x => x.Match)
                        .ToListAsync();

                    var totalProfit = predictions
                        .Select(x => _profitReader.Read(x)).Sum();

                    var totalUsers = await _ctx.Wagerers.CountAsync();

                    var openMatches = await _ctx.Matches.Where(
                        x => x.Predictions.Single(y => y.IsMain).PredictionStatusId == Domain.PredictionStatus.Open ||
                        x.Predictions.Single(y => y.IsMain).PredictionStatusId == Domain.PredictionStatus.Live).CountAsync();

                    AdminDashboardStats = new AdminDashboardDto
                    {   
                        LastUpdated = DateTime.Now,
                        OpenMatches = openMatches,
                        TotalProfit = totalProfit,
                        TotalUsers = totalUsers,
                    };
                }

                return AdminDashboardStats;
            }
        }

    }
}
