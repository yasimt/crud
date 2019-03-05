module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      //next(ex);
      let err = "";
      if (!ex.message) {
        err = ex;
      } else {
        err = ex.stack;
      }
      res.json({error: 1, msg: err});
    }
  };
};
