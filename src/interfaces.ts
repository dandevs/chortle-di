export interface IContainer {
    dependencies: {[key: string]: IDependency};
    host: Function;
}

export interface IDependency {
    type:         DependencyType;
    instance?:    any;
    constructor?: Function;
    args?:        any[];
}

export enum EventType {
    DEP_REGISTERED = "0",
}

export enum DependencyType {
    INSTANTIABLE,
    SINGLETON,
}