import { CanActivate, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DeleteManyGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(): Promise<boolean> {
    // TODO
    return true;
  }
}
