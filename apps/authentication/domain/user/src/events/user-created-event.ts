import { DomainEvent } from '@monorepo/arch/domain';
import { User } from '../user';

export class UserCreatedEvent extends DomainEvent<User> {}
