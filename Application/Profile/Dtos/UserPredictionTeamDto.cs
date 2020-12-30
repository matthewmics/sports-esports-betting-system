using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profile.Dtos
{
    public class UserPredictionTeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public bool IsSelected { get; set; }
    }
}
