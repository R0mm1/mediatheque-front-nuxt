export default interface EntityModuleInterface<T> {

    get(id: number): Promise<T | undefined>;

    set(entity: T): void;

    save(): Promise<T | boolean>;
}
