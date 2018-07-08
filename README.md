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

## replaceService(dependency, newDependency)
Overrides the dependency as to point to a different one
```ts
@injectable class A {
    @inject(B) b: B;
}

const a0 = new A();
replaceService(B, C);
const a1 = new A();

expect(a0.b instanceof B).toBe(true);
```