import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AdminUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<{ adminUser?: { username: string; role: string } }>();
  return request.adminUser;
});
