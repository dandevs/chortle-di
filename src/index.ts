import { IContainer, IDependency, EventType, DependencyType } from "./interfaces";

const Containers: WeakMap<any, IContainer> = new WeakMap();
const Injected: Map<Function,  IContainer> = new Map();
const Singletons: Map<any,     Function>   = new Map();

// ----------------------------------------------------------------

export function inject(constructor: Function, ...args: any[]) {
    return function(target: Object, property: string) {
        registerDependency(target.constructor, property, {
            type: DependencyType.INSTANTIABLE,
            constructor,
            args,
        });
    };
}

export namespace inject {
    export function singleton(constructor: Function, ...args: any[]) {
        return function(target: Object, property: string) {
            registerDependency(target.constructor, property, {
                type: DependencyType.SINGLETON,
                constructor,
                args,
            });
        };
    }
}

// ----------------------------------------------------------------

function registerDependency(target: Function, property: string, dependency: IDependency) {
    if (!Injected.has(target))
        Injected.set(target, createContainer(target));

    const container = Injected.get(target);
    container.dependencies[property] = dependency;

    // ---------------------------------------------------

    Object.defineProperty(target.prototype, property, {
        get() {
            const dependency: IDependency = this.$di.dependencies[property];

            if (!dependency.instance)
                dependency.instance = fabricateDependency(dependency);

            return dependency.instance;
        }
    });
}

function fabricateDependency(dependency: IDependency) {
    if (dependency.type === DependencyType.INSTANTIABLE)
        return Reflect.construct(dependency.constructor, dependency.args);

    if (dependency.type === DependencyType.SINGLETON) {
        if (!Singletons.has(dependency.constructor))
            Singletons.set(dependency.constructor, Reflect.construct(dependency.constructor, dependency.args));

        return Singletons.get(dependency);
    }
}

// ----------------------------------------------------------------

export function injectable(target: Function) {
    if (!Object.getOwnPropertyNames(target.prototype).includes("$di")) {
        Object.defineProperty(target.prototype, "$di", {
            get() {
                if (!Containers.has(this))
                    Containers.set(this, copyContainer(Injected.get(target)));

                return Containers.get(this);
            }
        });
    }

    return new Proxy<any>(target, {
        construct(target: Function, args) {
            const instance = Reflect.construct(target, args);
            instance.$di;
            return instance;
        }
    });
}

// ----------------------------------------------------------------

function createContainer(host: Function) {
    return <IContainer> {
        dependencies: {},
        host
    };
}

function copyContainer(original: IContainer) {
    const container: IContainer = createContainer(original.host);

    for (let key in original.dependencies) {
        container.dependencies[key] = { ...original.dependencies[key] };
    }

    return container;
}