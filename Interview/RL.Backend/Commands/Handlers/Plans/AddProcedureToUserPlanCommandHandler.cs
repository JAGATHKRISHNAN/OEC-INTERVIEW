using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RL.Backend.Exceptions;
using RL.Backend.Models;
using RL.Data;
using RL.Data.DataModels;

namespace RL.Backend.Commands.Handlers.Plans
{
    public class AddProcedureToUserPlanCommandHandler : IRequestHandler<AddProcedureToUserPlanCommand, ApiResponse<Unit>>
{
    private readonly RLContext _context;

    public AddProcedureToUserPlanCommandHandler(RLContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<Unit>> Handle(AddProcedureToUserPlanCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validate request
            if (request.PlanId < 1)
                return ApiResponse<Unit>.Fail(new BadRequestException("Invalid PlanId"));
            if (request.ProcedureId < 1)
                return ApiResponse<Unit>.Fail(new BadRequestException("Invalid ProcedureId"));
            if (request.UserIds == null || request.UserIds.Any(id => id < 1))
                return ApiResponse<Unit>.Fail(new BadRequestException("Invalid UserIds"));

            var plan = await _context.Plans
                .Include(p => p.PlanProcedureUsers)
                .FirstOrDefaultAsync(p => p.PlanId == request.PlanId);
            var procedure = await _context.Procedures.FirstOrDefaultAsync(p => p.ProcedureId == request.ProcedureId);

            if (plan is null)
                return ApiResponse<Unit>.Fail(new NotFoundException($"PlanId: {request.PlanId} not found"));
            if (procedure is null)
                return ApiResponse<Unit>.Fail(new NotFoundException($"ProcedureId: {request.ProcedureId} not found"));

            foreach (var userId in request.UserIds)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user is null)
                    return ApiResponse<Unit>.Fail(new NotFoundException($"UserId: {userId} not found"));

                // Already has the procedure, so just succeed
                if (plan.PlanProcedureUsers.Any(p => p.ProcedureId == procedure.ProcedureId && p.UserId == user.UserId))
                    continue;

                plan.PlanProcedureUsers.Add(new PlanProcedureUser
                {
                    ProcedureId = procedure.ProcedureId,
                    UserId = user.UserId
                });
            }

            await _context.SaveChangesAsync();

            return ApiResponse<Unit>.Succeed(new Unit());
        }
        catch (Exception e)
        {
            return ApiResponse<Unit>.Fail(e);
        }
    }
}

}
