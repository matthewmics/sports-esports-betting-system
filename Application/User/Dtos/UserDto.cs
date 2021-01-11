using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.User.Dtos
{
    public class UserDto : BaseUser
    {
        public decimal WalletBalance { get; set; }
        public string Photo { get; set; }
        public ICollection<PredictionNotificationDto> PredictionNotifications { get; set; }
    }
}
