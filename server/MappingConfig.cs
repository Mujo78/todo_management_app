using AutoMapper;
using server.DTO;
using server.Models;

namespace server
{
    public class MappingConfig: Profile
    {
        public MappingConfig() 
        {
            CreateMap<Assignment, AssignmentDTO>().ReverseMap();
            CreateMap<Assignment, AssignmentCreateDTO>().ReverseMap();
            CreateMap<Assignment, AssignmentUpdateDTO>().ReverseMap();


            CreateMap<User, UserDTO>().ReverseMap();
        }
    }
}
