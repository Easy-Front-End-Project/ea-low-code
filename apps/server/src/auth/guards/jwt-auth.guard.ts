import { Injectable, Logger, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      this.logger.warn(
        `JWT auth failed: ${info?.message || err?.message || 'unknown'}`
      );
      return super.handleRequest(err, user, info, context);
    }
    return user;
  }
}
