import { injectContainer } from "../utils";

/**
 * t.$di is called to actually create the di container
 *
 * @export
 * @param {Function} target
 * @returns
 */
export function injectable(target: Function) {
    injectContainer(target.prototype);

    return new Proxy<any>(target, {
        construct(target: Function, args) {
            const t = Reflect.construct(target, args);
            t.$di;
            return t;
        }
    });
}