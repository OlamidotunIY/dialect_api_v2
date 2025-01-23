import { Module } from '@nestjs/common';
import { WorkspaceResolver } from './workspace.resolver';

@Module({
  providers: [WorkspaceResolver]
})
export class WorkspaceModule {}
