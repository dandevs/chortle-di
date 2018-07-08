export class MapWithFactoryGet<T1, T2> extends Map<T1, T2> {
    constructor(private factory: (key?: T1) => T2) {
        super();
    }

    get(key) {
        if (!this.has(key))
            this.set(key, this.factory(key));

        return super.get(key);
    }
}