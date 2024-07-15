using MediatR;
using RL.Backend.Models;

namespace RL.Backend.Commands
{
    public class AddProcedureToUserPlanCommand : IRequest<ApiResponse<Unit>>
    {
        public List<int> UserIds { get; set; }
        public int PlanId { get; set; }
        public int ProcedureId { get; set; }
    }
}