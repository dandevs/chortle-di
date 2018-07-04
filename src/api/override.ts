import { Containers } from "../maps";

export function override(target: Function, property: string, newDep: Function) {
    const container = Containers.get(target);
    container.dependencies[property].constructor = newDep;
}

export namespace override {
    export function singleton(target: Function) {

    }
}