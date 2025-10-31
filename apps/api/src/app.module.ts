import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AgentsModule } from './agents/agents.module';

@Module({
  imports: [AgentsModule],
  controllers: [AppController],
})
export class AppModule {}
