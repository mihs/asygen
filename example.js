var gen = require("./index")
  , async = gen.async
  , all = gen.all;

function step(value, callback) {
  setTimeout(function() {
    callback(null, value);
  }, 10)
}

async(function*() {
  var one = yield step.sync(1);
  var two = yield step.sync(2);
  console.log(one + two); // 3
});

async(function*() {
  var results = yield all(step.sync(1), step.sync(2));
  console.log(results[0] + results[1]); // 3
});
