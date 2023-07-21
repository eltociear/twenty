import {
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { subject } from '@casl/ability';

import { IAbilityHandler } from 'src/ability/interfaces/ability-handler.interface';

import { PrismaService } from 'src/database/prisma.service';
import { AbilityAction } from 'src/ability/ability.action';
import { AppAbility } from 'src/ability/ability.factory';
import { CommentThreadTargetWhereInput } from 'src/core/@generated/comment-thread-target/comment-thread-target-where.input';
import { UpdateOneCommentThreadTargetArgs } from 'src/core/@generated/comment-thread-target/update-one-comment-thread-target.args';
import { assert } from 'src/utils/assert';
import { checkRelationPermission } from 'src/ability/ability.util';

class CommentThreadTargetArgs {
  where?: CommentThreadTargetWhereInput;
}

@Injectable()
export class ManageCommentThreadTargetAbilityHandler
  implements IAbilityHandler
{
  async handle(ability: AppAbility) {
    return ability.can(AbilityAction.Manage, 'CommentThreadTarget');
  }
}

@Injectable()
export class ReadCommentThreadTargetAbilityHandler implements IAbilityHandler {
  handle(ability: AppAbility) {
    return ability.can(AbilityAction.Read, 'CommentThreadTarget');
  }
}

@Injectable()
export class CreateCommentThreadTargetAbilityHandler
  implements IAbilityHandler
{
  handle(ability: AppAbility) {
    return ability.can(AbilityAction.Create, 'CommentThreadTarget');
  }
}

@Injectable()
export class UpdateCommentThreadTargetAbilityHandler
  implements IAbilityHandler
{
  constructor(private readonly prismaService: PrismaService) {}

  async handle(ability: AppAbility, context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const args = gqlContext.getArgs<UpdateOneCommentThreadTargetArgs>();
    const commentThreadTarget =
      await this.prismaService.client.commentThreadTarget.findFirst({
        where: args.where,
      });
    assert(commentThreadTarget, '', NotFoundException);

    await checkRelationPermission(this.prismaService, {
      args,
      relations: [{ name: 'commentThread', model: 'CommentThread' }],
      workspaceId: commentThreadTarget.workspaceId,
      operations: ['connect'],
    });

    return ability.can(
      AbilityAction.Update,
      subject('CommentThreadTarget', commentThreadTarget),
    );
  }
}

@Injectable()
export class DeleteCommentThreadTargetAbilityHandler
  implements IAbilityHandler
{
  constructor(private readonly prismaService: PrismaService) {}

  async handle(ability: AppAbility, context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const args = gqlContext.getArgs<CommentThreadTargetArgs>();
    const commentThreadTarget =
      await this.prismaService.client.commentThreadTarget.findFirst({
        where: args.where,
      });
    assert(commentThreadTarget, '', NotFoundException);

    return ability.can(
      AbilityAction.Delete,
      subject('CommentThreadTarget', commentThreadTarget),
    );
  }
}
