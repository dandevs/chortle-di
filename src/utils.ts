import { IContainer, IDependency } from "./interfaces";
import { Containers } from "./maps";

export function createContainer(defaults: IContainer = <any>{}): IContainer {
    return <IContainer> {
        dependencies: {},
        ...defaults,
    };
}

export function registerDependency(target: Function, property: string, dependency: IDependency) {
    if (!Containers.has(target))
        Containers.set(target, createContainer());

    const container = Containers.get(target);
    container.dependencies[property] = dependency;

    return dependency;
}