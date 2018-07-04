import { inject, override } from "../src";
let i = 0;

class Bar {
    value = i++;
}

class Foo {
    @inject(Bar) bar: Bar;

    constructor(public value?) {
        console.log(value);
        console.log(this.bar.value);
    }
}

describe("Chortle", () => {
    it("Can inject dependencies", () => {
        const a = new Foo("hello"),
              b = new Foo("world");

        expect(a.value).toBe("hello");
        expect(b.value).toBe("world");
    });

    it("#override", () => {
        override.singleton;
    });
});