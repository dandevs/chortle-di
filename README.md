# Chortle

### Features
* Lazily loaded
* Simple

### Example
```ts
import { inject, injectable } from "chortle-di"

class Foo {
    hello() {
        return "world"
    }
}

@injectable class Bar {
    @inject(Foo) foo: Foo

    constructor(baz?: any) {
        console.log(`fizz${baz} from ${this.foo.hello()}`)
    }
}

const bar = new Bar("buzz")
```

# API

## @injectable
Decorator that makes a class injectable and ensures it works properly
#### Caveats
* Transforms class into a proxy

## @inject(target, ...args)

## @inject.singleton(target, ...args)

## override(target, property, newDependency)
New instances of targets property will use the new dependency
```js
class B {}
class C {}

@injectable class A {
    @inject.singleton(B) b: B;
}

const lazy = new A();
override(A, "b", C);

expect(new A().b instanceof C).toBe(true);
expect(lazy.b instanceof C).toBe(false);
```

## override(dependency, newDependency)
Overrides the dependency as to point to a different one
```js
class B {}
class C {}

@injectable class A {
    @inject(B) b: B;
}

const lazy = new A();

expect(new A().b instanceof B).toBe(true);
override(B, C);
expect(new A().b instanceof C).toBe(true);
expect(lazy.b instanceof B).toBe(true);
```