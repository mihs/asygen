function prepResult(args, from) {
  var args = [].slice.call(args, from || 0);
  if (args.length < 1)
    args = null;
  else if (args.length == 1)
    args = args[0];
  return args;
}

Function.prototype.sync = function() {
  var args = [].slice.call(arguments);
  return all({call: this, args: args});
}

module.exports.all = all = function(steps) {
  steps = [].slice.call(arguments);
  var finished = 0, results = [], errors = [], error = null, control;

  function thecall() {
    for (var i = 0; i < steps.length; i++) {
      callback = stepCallback(i);
      steps[i].args.push(callback);
      steps[i].callback = callback;
      steps[i].call.apply(null, steps[i].args);
    }
  }

  function stepCallback(index) {
    return function(err) {
      if (results[index] || errors[index])
        return;
      var args = prepResult(arguments, 1);
      results[index] = args;
      errors[index] = err;
      error = err;
      finished++;
      if (finished === steps.length)
        process.nextTick(function(){
          control.callback(error, steps.length > 1 ? results : results[0]);
        });
    }
  }
  
  control = {call: thecall, args: []};
  return control;
}

module.exports.async = function(gen) {
  var next, cresult;
  if (typeof(gen) === "function")
    gen = gen();
  else
    throw new Error("Parameter must be a generator function");
  if (!gen.next)
    throw new Error("Parameter must be a generator");

  var callback = function(err) {
    if (err)
      return gen.throw(err);
    cresult = {err: err, value: prepResult(arguments, 1)};
    process.nextTick(handler);
  }

  var handler = function() {
    if (next) {
      next.value.result = cresult
      if (cresult.err)
        gen.throw(cresult.err)
    }
    next = gen.next(cresult != null ? cresult.value : null);
    if (next.value && next.value.call) {
      next.value.callback = callback;
      next.value.args.push(callback);
      next.value.call.apply(null, next.value.args);
    }
    else
      if (!next.done) {
        process.nextTick(handler);
      }
  }

  process.nextTick(handler);
}
