import { ServiceInfo, IService, IServices } from "../service";
import { MasterContainers } from "../container";

export function replaceService(serviceToReplace: Function, newService: Function, ...newArgs: any[]) {
    ServiceInfo.installedOn.get(serviceToReplace).forEach((manifest: IServices, hostConstructor: Function) => {
        const masterContainer = MasterContainers.get(hostConstructor);
        masterContainer.overrides = masterContainer.overrides || {};

        for (let property of Object.keys(manifest)) {
            const masterService = manifest[property];

            masterContainer.overrides[property] = {
                ...masterService,
                constructor: newService,
                args: newArgs,
            };
        }
    });
}