import { inject, override, injectable } from "../src";
let i = 0;

class Bar {
    value = i++;
}

class Baz {
    value = "bazinga...";
}

class Logger {}

@injectable class Foo {
    @inject(Bar) bar: Bar;

    constructor(public value?) { }
}

it("Can inject dependencies", () => {
    const a = new Foo("hello"),
          b = new Foo("world");

    expect(a.value).toBe("hello");
    expect(b.value).toBe("world");

    // Make sure it isn't instantiating new deps

    expect(a.bar === b.bar).toBe(false);
    expect(a.bar.value).toBe(a.bar.value);
    expect(a.bar.value === b.bar.value).toBe(false);
});

it.only("#override", () => {
    override(Foo, "bar", Baz);
    // const pre = new Foo("pre");
    // expect(typeof pre.bar.value).toBe("number");

    // override(Foo, "bar", Baz);
    // const post = new Foo("post");

    // expect(typeof post.bar.value).toBe("string");
});

it("Multi dependency injection", () => {
    class B {}
    class C {}

    @injectable class A {
        @inject(B) b: B;
        @inject(C) c: C;
    }

    // @ts-ignore
    new A().$di; //?
});