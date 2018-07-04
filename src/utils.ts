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

export function injectContainer(target: Object) {
    if (Object.getOwnPropertyNames(target).includes("$di"))
        return false;

    Object.defineProperty(target, "$di", {
        get() {
            if (!Containers.has(this))
                Containers.set(this, copyContainer(Containers.get(target.constructor)));

            return Containers.get(this);
        }
    });

    return true;
}

export function copyContainer(original: IContainer) {
    return <IContainer> {
        dependencies: { ...original.dependencies }
    };
}