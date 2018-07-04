const Containers: WeakMap<any, IContainer> = new WeakMap();

export function inject<T extends Function>(dependency: T, ...args) {
    return function(target: Object, property: string) {
        const injection = registerDependency(target.constructor, property, {
            type:        DependencyType.INSTANTIABLE,
            constructor: dependency,
        });

        injectContainer(target);
        injectInstatiable(target, property, injection, args);
    };
}

function injectInstatiable(target: Object, property: string, injection: IDependency, args: any[]) {
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

function registerDependency(target: Function, property: string, dependency: IDependency) {
    if (!Containers.has(target))
        Containers.set(target, createContainer());

    const container = Containers.get(target);
    container.dependencies[property] = dependency;

    return dependency;
}

function createContainer(defaults: IContainer = <any>{}): IContainer {
    return <IContainer> {
        dependencies: {},
        ...defaults,
    };
}

export function override(target: Function) {

}

export namespace override {
    export function singleton(target: Function) {

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


enum DependencyType {
    INSTANTIABLE,
    SINGLETON,
    VALUE
}

interface IDependency {
    constructor?: any;
    instance?:    any;
    args?:        any[];
    type:         DependencyType;
}

interface IContainer {
    dependencies: {[key: string]: IDependency};
}