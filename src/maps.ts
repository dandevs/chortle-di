import { IContainer } from "./interfaces";

export const Containers: WeakMap<any, IContainer> = new WeakMap();
export const Singletons = new WeakMap();