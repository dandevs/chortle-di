import cloneDeepWith from "lodash.clonedeepwith";
import { MapWithFactoryGet } from "./maps";
import { IService, IServices } from "./service";

export const MasterContainers: Map<Function, IContainer> = new MapWithFactoryGet(() => createContainer());
export const ContainerInstances: WeakMap<Function, IContainer> = new WeakMap();

export function createContainer(container?: IContainer) {
    container = cloneContainer(container) || {};

    return <IContainer> {
        services: {},
        ...container,
    };
}

// TODO: Replace cloneDeep with in house function (lodash too big?)
export function cloneContainer(original: IContainer) {
    return cloneDeepWith(original, (value, key) => {
        if (value instanceof Object) {
            if (key === "constructor" || key === "instance")
                return value;
        }
    });
}

export interface IContainer {
    services?: { [property: string]: IService };
    overrides?: IServices;
    host?: Function;
}