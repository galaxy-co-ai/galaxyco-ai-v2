import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AgentsController } from './agents/agents.controller';

@Module({
  controllers: [AppController, AgentsController],
})
export class AppModule {}
