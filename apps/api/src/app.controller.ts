import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  health() {
    return {
      status: 'ok',
      service: 'galaxyco-api',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get()
  root() {
    return {
      message: 'GalaxyCo.ai API v2.0',
      docs: '/api/docs',
      health: '/health',
    };
  }
}
