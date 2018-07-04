import { Containers } from "../maps";
import { DependencyType, IContainer, IDependency } from "../interfaces";
import { registerDependency, injectContainer } from "../utils";

export function inject<T extends Function>(dependency: T, ...args) {
    return function(target: Object, property: string) {
        const injection = registerDependency(target.constructor, property, {
            type:        DependencyType.INSTANTIABLE,
            constructor: dependency,
        });

        injectContainer(target);
        inject.instantiable(target, property, injection, args);
    };
}

export namespace inject {
    export function instantiable(target: Object, property: string, injection: IDependency, args: any[]) {
        Object.defineProperty(target, property, {
            get() {
                const container: IContainer = this.$di;
                let   service: IDependency  = container.dependencies[property];

                if (!service.instance) {
                    service.instance = Reflect.construct(injection.constructor, args);
                }

                return service.instance;
            }
        });
    }

    export function singleton(target: Object) {

    }
}