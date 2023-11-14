export interface Entity {
  }
  
declare class EntityManager {
    private _generation: Map<number, number>;
    private _free_indices: number[];
    private _entities: Map<number, Entity>;
    private _components: Map<number, Map<string, any[]>>;
    private __entities_with_type: Map<string, Map<number, Entity>>;

    create(): Entity;
    make_entity(index: number, generation: number): Entity;
    alive(e: Entity): boolean;
    destroy(e: Entity): void;
    asign(component: any, e: Entity): void;
    get<T>(c_type: new (...args: any) => T, e: Entity): T[];
    remove(component: any, e: Entity): void;
    getEnities(c_type: any): Entity[];
}