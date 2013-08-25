# Asygen

Making node callback style functions work with generators.

## Status

Experimental

## TODO

* rewrite
* generator composability
* tests

## Examples

```js
var asygen = require('asygen');
var all = asygen.all;
var async = asygen.async;

function step(value, callback) {
  setTimeout(function() {
    callback(null, value);
  }, 10)
}
```

## Sequential

```js
async(function*() {
  var one = yield step.sync(1);
  var two = yield step.sync(2);
  console.log(one, two); // 1, 2
});
```

## Parallel

```js
async(function*(){
  var [one, two] = yield all(step.sync(1), step.sync(2));
  console.log(one, two); // 1, 2
});
```

## Similar projects

suspend

galaxy

TBW

## License

MIT
