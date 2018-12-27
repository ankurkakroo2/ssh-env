const success = message => ({
  status: 'success',
  message
});

const error = message => ({
  status: 'error',
  message
});

module.exports = {
  success,
  error
};
