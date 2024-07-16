import { randomUUID } from 'crypto';

export interface EntityProps {
  id?: string;
}

export abstract class Entity {
  id?: string;

  constructor(id?: string) {
    this.id = id ?? randomUUID();
  }

  equals(entity: Entity) {
    if (entity === this) return true;

    if (entity.id === this.id) return true;

    return false;
  }
}
