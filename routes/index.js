function initiator(router, app) {
  let api_path = "../routes/api";

  require(api_path + "/post.js")(router, app);
}
module.exports = initiator;
