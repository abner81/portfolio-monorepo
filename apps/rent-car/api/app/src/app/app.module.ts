import { Module, OnModuleInit } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveryService } from '@nestjs/core';
import { BaseController } from '@monorepo/arch/controller';
import { ImplementationException } from '@monorepo/exceptions';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DiscoveryService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    const controllers = this.discoveryService.getControllers();

    controllers.forEach((wrapper) => {
      const instance = wrapper.instance;

      if (instance && !(instance instanceof BaseController)) {
        throw new ImplementationException(
          `O controlador ${instance.constructor.name} não herda de BaseController. Verifique sua configuração.`
        );
      }
    });
  }
}
