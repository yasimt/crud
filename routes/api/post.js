function initiator(router, app) {
  app.use("/api/post/", router);

  const dataCntlr = require("../../controllers/post.controller");

  router.get("/*:id", dataCntlr.getPost);
  router.post("/create", dataCntlr.createPost);
  router.put("/update/:id", dataCntlr.updatePost);
  router.delete("/delete/:id", dataCntlr.deletePost);
}
module.exports = initiator;
