import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import type { AuthenticatedUser } from '../decorators/user.decorator';
import { WorkspaceId } from '../decorators/workspace.decorator';

@Controller('agents')
@UseGuards(AuthGuard)
export class AgentsController {
  @Get()
  async listAgents(
    @User() user: AuthenticatedUser,
    @WorkspaceId() workspaceId: string,
  ) {
    return {
      message: 'This is a protected endpoint!',
      user: {
        id: user.id,
        sessionId: user.sessionId,
      },
      workspaceId,
      agents: [
        {
          id: '1',
          name: 'Example Agent',
          type: 'scope',
          status: 'active',
          workspaceId,
        },
      ],
      _note: 'This endpoint is protected by Clerk authentication and requires workspace ID in headers',
    };
  }

  @Get('health')
  async health() {
    return {
      status: 'ok',
      service: 'agents-controller',
      protected: true,
      timestamp: new Date().toISOString(),
    };
  }
}
