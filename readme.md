<!-- markdownlint-disable MD004 MD007 MD010 MD041	MD022 MD024	MD032 MD036-->

# reduce-to

_convert and modify Arrays, Objects, Maps, Sets and Strings_
_a powerful utility belt well under 1kb gzip, no dependencies_

## example

```javascript
var x = require('reduce-to')

// CONVERSIONS
var source = ['a', 'b', 'c'],
    map = x(source, new Map), // Map of [0,'a'], [1, 'b'], [2, 'c']
    obj = x(map, {}), // {'0': 'a', '1': 'b', '2': 'c'}
    set = x(obj, new Set) // Set of 'a', 'b', 'c'
    txt = x(set, '') // 'abc'
    arr = x(txt, []) // same as source

// LAZY TRANSFORMS WITH TRANSDUCERS
var zAC = x(
  set, //start from any of the supported types
  x.filter(v=>v!=='b'), //filter transducer
  x.map(v=>v.toUpperCase(), //map transducer
  'z' //target with initial value
)) // 'zAC
```

## use cases

* apply multiple transforms in a lazy and efficient way
* convert to any javascript key-value data types
  * `var myMap = x(JSON.parse(json), new Map)`
  * `var json = x(set, [])`
  * `var noDuplicates = x(x(arr, new Set), [])`
  * `var shallowClone = x(obj, {})`
  * `var plusOne = x(new Int8Array([1,2,3]), x.map(v=>v+1))` converted to an Array
* works seamlesly in ES5

## supported types

* _Input:_ `Array`, `Strings`, `Object`, `Map`, `Set`, `Iterators`
* _Output:_ `Array`, `Strings`, `Object`, `Map`, `Set`, `WeakMap`, `WeakSet`

## key value conversions

* `Array`: index, value
* `String`: index, value
* `Object`: key, value
* `Map`: key.toString(), value
* `Set`: index, value
* `Iterators`: index, value

## transducer and reducer functions

To keep things light and simple, only 3 reducer types are provided
* `.map((val, key, source) => newValue)`
* `.filter((val, key, source) => Boolean)`
* `.index((val, index, source) => Boolean)`

`index` is similar to `filter` but with a counter index instead of the key (same as `Array.filter`).
Most common other reducers can be emulated with these 3 base reducers:
* `take(N)`: use `count((val, idx) => idx < N)`
* `drop(N)`: use `count((val, idx) => idx >= N)`
* ...`reject`, `dropWhile`, ...
