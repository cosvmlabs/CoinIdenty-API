const moment = require('moment');

const getParams = req => {
  const { query, body } = { ...req };
  return { ...query, ...body };
};

const errorOutput = error => {
  return {
    error: true,
    code: 400,
    message: error?.message,
  };
};

const finalizeOutput = (output, params, start_time = moment()) => {
  const { method } = { ...params };
  // on error, add parameters to output
  if (output?.error) {
    output = {
      ...output,
      method: output.method || method,
      params: output.params || params,
    };
  }
  // add time spent to output
  if (output && typeof output === 'object' && !Array.isArray(output)) {
    output = {
      ...output,
      time_spent: moment().diff(start_time),
    };
  }
  return output;
};

module.exports = {
  getParams,
  errorOutput,
  finalizeOutput,
};