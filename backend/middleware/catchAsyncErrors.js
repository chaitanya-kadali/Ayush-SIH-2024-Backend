const catchAsyncErrors = (TheFun) => (req, res, next) => {
  Promise.resolve(TheFun(req, res, next)).catch(next);
};

module.exports = catchAsyncErrors;
