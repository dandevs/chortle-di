export interface IContainer {
    dependencies: {[key: string]: IDependency};
    overrides?: {[key: string]: IOverride};
    overridenDeps?: Map<Function, IOverride>;
    host: Function;
}

export interface IOverride {
    constructor?: any;
    args?: any[];
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