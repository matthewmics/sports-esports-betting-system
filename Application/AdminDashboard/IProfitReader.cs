using System;
using System.Collections.Generic;
using System.Text;

namespace Application.AdminDashboard
{
    public interface IProfitReader
    {
        decimal Read(Domain.Prediction prediction);
    }
}
