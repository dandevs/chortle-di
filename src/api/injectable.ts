export function injectable(target: Function) {
    console.log(target);

    return new Proxy<any>(target, {
        construct(target: Function, args) {
            const t = Reflect.construct(target, args);
            t.$di;
            return t;
        }
    });
}