const mongoose = require("mongoose");
const User = require("./user.model");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    concert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concert",
    },
  },
  {
    collection: "Comments",
  },
  {
    timestamps: true,
  }
);

commentSchema.methods.toCommentResponse = async function (user) {
  const authorObj = await User.findById(this.author).exec();
  let userIsAuthor = false;
  let isFollowing = false;
  if (user && authorObj) {
    userIsAuthor = String(authorObj._id) === String(user._id);
    const validFollowing = (user.following || []).filter((id) => id);
    isFollowing = validFollowing.some((id) => id.toString() === authorObj._id.toString());
  }

  return {
    commentId: this._id,
    text: this.text,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: await authorObj.toMessageResponse(isFollowing),
    userIsAuthor: userIsAuthor,
  };
};

module.exports = mongoose.model("Comment", commentSchema);
