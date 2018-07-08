import { MapWithFactoryGet } from "./maps";

export const Singletons: Map<any, IService> = new Map();

export function createService(service: IService) {
    return service;
}

export namespace ServiceInfo {
    export const installedOn: Map<any, Map<any, IServices>> = new MapWithFactoryGet(() => {
        return new MapWithFactoryGet(() => {
            return {};
        });
    });
}

export type IServices = { [property: string]: IService };

export interface IService {
    type:         ServiceType;
    constructor?: Function;
    instance?:    any;
    args?:        any[];
}

export enum ServiceType {
    INSTANTIABLE,
    SINGLETON,
}