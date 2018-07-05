import { IContainer, IDependency, EventType, DependencyType, IOverride } from "./interfaces";

const Containers: WeakMap<any,             IContainer> = new WeakMap();
const Injected: Map<Function,              IContainer> = new Map();
const Singletons: Map<any,                 Function>   = new Map();
const OverridenConstructors: Map<Function, IOverride>  = new Map();

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
            const container: IContainer   = this.$di;
            const dependency: IDependency = container.dependencies[property];

            if (!dependency.instance) {
                dependency.instance = fabricateDependency(
                    dependency,
                    container.overrides ? container.overrides[property] : undefined,
                    container.overridenDeps);
            }

            return dependency.instance;
        }
    });
}

function fabricateDependency(dependency: IDependency, override: IOverride, overrideDeps?: Map<any, IOverride>) {
    let [constructor, args] = [dependency.constructor, dependency.args];

    if (override) {
        if (override.constructor)
            constructor = override.constructor;

        if (override.args)
            args = override.args || [];
    }

    // TODO: Make this recursive?
    if (overrideDeps && overrideDeps.has(constructor)) {
        const o = overrideDeps.get(constructor);
        constructor = o.constructor;
        args = o.args;
    }

    if (dependency.type === DependencyType.INSTANTIABLE)
        return Reflect.construct(constructor, args);

    if (dependency.type === DependencyType.SINGLETON) {
        if (!Singletons.has(constructor))
            Singletons.set(constructor, Reflect.construct(constructor, args));

        return Singletons.get(constructor);
    }
}

// ----------------------------------------------------------------

export function injectable(target: Function) {
    if (Object.getOwnPropertyNames(target.prototype).indexOf("$di") === -1) {
        Object.defineProperty(target.prototype, "$di", {
            get() {
                if (!Containers.has(this))
                    Containers.set(this, copyContainer(Injected.get(target)));

                return Containers.get(this);
            }
        });
    }

    const proxy = new Proxy<any>(target, {
        construct(target: Function, args) {
            const instance = Reflect.construct(target, args);
            instance.$di;
            return instance;
        }
    });

    Injected.set(proxy, Injected.get(target));
    return proxy;
}

// ----------------------------------------------------------------

export function override(target: Function, property: string, newDep: Function, ...depArgs: any[]);
export function override(target: Function, replaceWith: Function, ...depArgs: any[]);
export function override(...args) {
    if (typeof args[1] === "string") {
        // @ts-ignore
        overrideProperty(...args);
    }
    else {
        // @ts-ignore
        overrideDependency(...args);
    }
}

function overrideProperty(target: Function, property: string, newDep: Function, ...depArgs: any[]) {
    const container = Injected.get(target);

    container.overrides[property] = {
        constructor: newDep,
        args: depArgs
    };
}

function overrideDependency(target: Function, replaceWith: Function, ...depArgs: any[]) {
    OverridenConstructors.set(target, {
        constructor: replaceWith,
        args: depArgs,
    });
}

// ----------------------------------------------------------------

function createContainer(host: Function) {
    return <IContainer> {
        overridenDeps: OverridenConstructors,
        dependencies: {},
        overrides:    {},
        host
    };
}

function copyContainer(original: IContainer) {
    const container: IContainer = createContainer(original.host);

    for (let key in original.dependencies)
        container.dependencies[key] = { ...original.dependencies[key] };

    for (let key in original.overrides)
        container.overrides[key] = { ...original.overrides[key] };

    if (original.overridenDeps)
        container.overridenDeps = new Map(original.overridenDeps);

    return container;
}

export default { inject, injectable, override };