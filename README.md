### Chortle
Currently in prototyping phase

#
### Features
* Lazily loaded
* Simple

### Example
```ts
    import { inject, injectable } from "chort-di"

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