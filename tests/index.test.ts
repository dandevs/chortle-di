import { inject, injectable, override } from "../src";

test("Can inject", () => {
    class B { value = Math.random(); }

    class C {
        constructor(public value?: any) {}
    }

    @injectable class A {
        @inject(B) b: B;
        @inject(C, "foobar") c: C;

        constructor(public value?: string) {}
    }

    const a0 = new A("hello");
    const a1 = new A("world");

    expect(a0.b === a1.b).toBe(false);
    expect(a0.value).toBe("hello");
    expect(a1.value).toBe("world");

    expect(a0.c.value).toBe("foobar");
});

test("#inject.singleton()", () => {
    class A {}

    @injectable class B {
        @inject.singleton(A) a: A;
    }

    const i0 = new B();
    const i1 = new B();

    expect(i0.a instanceof A).toBe(true);
    expect(i0.a === i1.a).toBe(true);
});

test("#override()", () => {
    class B {}
    class C {}

    @injectable class A {
        @inject.singleton(B) b: B;
    }

    expect(new A().b instanceof B).toBe(true);
    override(A, "b", C);
    expect(new A().b instanceof C).toBe(true);
});