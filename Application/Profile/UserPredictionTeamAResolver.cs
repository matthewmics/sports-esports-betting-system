using Application.Photo;
using Application.Profile.Dtos;
using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profile
{
    public class UserPredictionTeamAResolver : IValueResolver<Domain.UserPrediction, Dtos.UserPredictionDto, Dtos.UserPredictionTeamDto>
    {
        private readonly IMapper _mapper;
        private readonly IImageHostGenerator _imageHostGenerator;

        public UserPredictionTeamAResolver(IMapper mapper, IImageHostGenerator imageHostGenerator)
        {
            _mapper = mapper;
            this._imageHostGenerator = imageHostGenerator;
        }

        public UserPredictionTeamDto Resolve(UserPrediction source, UserPredictionDto destination,
            UserPredictionTeamDto destMember, ResolutionContext context)
        {
            var teamSource = source.Prediction.Match.TeamA;
            var team = _mapper.Map<Dtos.UserPredictionTeamDto>(teamSource);
            team.IsSelected = source.TeamId == team.Id;
            if (teamSource.Image != null)
                team.Image = _imageHostGenerator.GetHostImage(teamSource.Image);
            return team;
        }
    }
}
