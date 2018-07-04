export interface IDependency {
    constructor?: any;
    instance?:    any;
    args?:        any[];
    type:         DependencyType;
}

export interface IContainer {
    dependencies: {[key: string]: IDependency};
}

export enum DependencyType {
    INSTANTIABLE,
    SINGLETON,
    VALUE
}

export enum EventType {
    REGISTER_DEP
}