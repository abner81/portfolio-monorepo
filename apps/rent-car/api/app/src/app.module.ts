import { Module, OnModuleInit } from '@nestjs/common';

import { DiscoveryService } from '@nestjs/core';
import { BaseController } from '@monorepo/arch/controller';
import { ImplementationException } from '@monorepo/exceptions';
import { RentCarApplicationModule } from 'rent-car/api/application';
import { RentModule } from './rent/rent.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [RentCarApplicationModule, RentModule, StoreModule],
  controllers: [],
  providers: [DiscoveryService],
})
export class RentCarAppModule implements OnModuleInit {
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
