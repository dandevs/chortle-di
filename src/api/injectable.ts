import { MasterContainers, createContainer, ContainerInstances, cloneContainer } from "../container";
import { ServiceInfo } from "../service";

export function injectable(target: Function) {
    Object.defineProperty(target.prototype, "$di", {
        get() {
            if (!ContainerInstances.get(this))
                ContainerInstances.set(this, cloneContainer(MasterContainers.get(target)));

            return ContainerInstances.get(this);
        }
    });

    const proxy = new Proxy<any>(target, {
        construct(target: Function, args: any[]) {
            const instance = Reflect.construct(target, args);
            instance.$di;
            return instance;
        }
    });

    return proxy;
}