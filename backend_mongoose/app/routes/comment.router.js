module.exports = (app) => {
  const verifyJWT = require("../middleware/verifyJWT");
  const verifyJWTOptional = require("../middleware/verifyJWTOptional");
  const comment = require("../controllers/comment.controller");

  //POST Comment
  app.post("/comments/:slug", verifyJWT, comment.addCommentsToConcert);

  //GET Comments from concert
  app.get("/comments/:slug", verifyJWTOptional, comment.getCommentsFromConcert);

  //DELETE Comment from concert
  app.delete("/comments/:id/concerts/:slug", verifyJWT, comment.deleteCommentFromConcert);
};
