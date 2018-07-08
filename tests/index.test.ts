import { inject, injectable, replaceService } from "../src";

describe("#injectable()", () => {
    it("Creates instances", () => {
        @injectable class C {
            constructor(public value: any) { }
        }

        @injectable class B {
            @inject(C, "foo") c: C;
        }

        @injectable class A {
            @inject(B) b: B;
        }

        const a = new A();

        expect(a.b instanceof B).toBe(true);
        expect(a.b.c instanceof C).toBe(true);
        expect(a.b.c.value).toBe("foo");
    });

    it("#singleton()", () => {
        class B {
            public value: number;

            constructor() {
                this.value = Math.random();
            }
        }

        @injectable class A {
            @inject.singleton(B) b: B;
        }

        const a0 = new A();
        const a1 = new A();

        expect(a0.b === a1.b).toBe(true);
    });
});

describe.only("#replaceService()", () => {
    class C { }
    class B { }

    it("type: INSTANTIABLE", () => {
        @injectable class A {
            @inject(B) b: B;
        }

        const a0 = new A();
        replaceService(B, C);
        const a1 = new A();

        expect(a0.b instanceof B).toBe(true);
        expect(a1.b instanceof C).toBe(true);
    });

    it("type: SINGLETON", () => {
        @injectable class A {
            @inject.singleton(B) b: B;
        }

        const a0 = new A();
        replaceService(B, C);
        const a1 = new A();

        expect(a0.b instanceof B).toBe(true);
        expect(a1.b instanceof C).toBe(true);
    });
});