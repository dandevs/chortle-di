import { Containers } from "./maps";
import { DependencyType, IContainer, IDependency } from "./interfaces";
import { registerDependency, createContainer } from "./utils";

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
                let service: IDependency = container.dependencies[property];

                if (!service) {
                    service = container.dependencies[property] = { ...Containers.get(target.constructor).dependencies[property] };
                }

                if (!service.instance) {
                    service.instance = Reflect.construct(injection.constructor, args);
                }

                return service.instance;
            }
        });
    }
}

function injectContainer(target: Object) {
    Object.defineProperty(target, "$di", {
        get() {
            if (!Containers.has(this))
                Containers.set(this, createContainer());

            return Containers.get(this);
        }
    });
}