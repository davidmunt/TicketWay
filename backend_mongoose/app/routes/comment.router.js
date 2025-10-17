// module.exports = (app) => {
//   const { verifyJWT } = require("../middleware/verifyJWT");
//   const verifyJWTOptional = require("../middleware/verifyJWTOptional");
//   const comment = require("../controllers/comment.controller");

//   // GET ALL COMMENTS
//   app.get("/:slug/comments", verifyJWTOptional, comment.getCommentsFromJob);

//   // ADD COMMENT
//   app.post("/:slug/comments", verifyJWT, comment.addCommentsToJob);

//   // DELETE COMMENT
//   app.delete("/:slug/comments/:id", verifyJWT, comment.deleteComment);
// };
