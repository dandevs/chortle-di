import { createService, ServiceType, ServiceInfo, IService, Singletons } from "../service";
import { MasterContainers, createContainer, IContainer } from "../container";

export function inject(serviceConstructor: Function, ...args: any[]) {
    return function(target: Object, property: string) {
        injectServiceIntoContainer(target.constructor, property, createService({
            type:        ServiceType.INSTANTIABLE,
            constructor: serviceConstructor,
            args,
        }));

        injectServiceToPrototype(target, property);
    };
}

export namespace inject {
    export function singleton(serviceConstructor: Function) {
        return function(target: Object, property: string) {
            injectServiceIntoContainer(target.constructor, property, createService({
                type:        ServiceType.SINGLETON,
                constructor: serviceConstructor,
            }));

            injectServiceToPrototype(target, property);
        };
    }
}

function injectServiceToPrototype(target: Object, property: string) {
    Object.defineProperty(target, property, {
        get() {
            const container: IContainer = this.$di,
                  service               = container.services[property];

            if (service.instance)
                return service.instance;

            let serviceToBuild: IService = service;

            if (container.overrides && container.overrides[property]) {
               serviceToBuild = container.overrides[property];
            }

            if (service.type === ServiceType.INSTANTIABLE) {
                service.instance = Reflect.construct(serviceToBuild.constructor, serviceToBuild.args);
            }

            else if(service.type === ServiceType.SINGLETON) {
                if (!Singletons.has(serviceToBuild.constructor))
                    Singletons.set(serviceToBuild.constructor, Reflect.construct(serviceToBuild.constructor, []));

                service.instance = Singletons.get(serviceToBuild.constructor);
            }

            return service.instance;
        }
    });
}

export function injectServiceIntoContainer(targetConstructor: Function, property: string, service: IService) {
    const masterContainer = MasterContainers.get(targetConstructor);

    masterContainer.services[property] = service;
    ServiceInfo.installedOn.get(service.constructor).get(targetConstructor)[property] = service;
}