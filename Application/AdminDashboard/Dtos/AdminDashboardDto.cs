using System;
using System.Collections.Generic;
using System.Text;

namespace Application.AdminDashboard.Dtos
{
    public class AdminDashboardDto
    {
        public decimal TotalProfit { get; set; }
        public int TotalUsers { get; set; }
        public int OpenMatches { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
