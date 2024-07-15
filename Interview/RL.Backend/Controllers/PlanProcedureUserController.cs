using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using RL.Data;
using RL.Data.DataModels;

namespace RL.Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class PlanProcedureUserController : ControllerBase
{
    private readonly ILogger<PlanProcedureUserController> _logger;
    private readonly RLContext _context;

    public PlanProcedureUserController(ILogger<PlanProcedureUserController> logger, RLContext context)
    {
        _logger = logger;
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    [HttpGet]
    [EnableQuery]
    public IEnumerable<PlanProcedureUser> Get()
    {
        return _context.PlanProcedureUsers;
    }
}
