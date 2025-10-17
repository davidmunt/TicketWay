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
  if (!authorObj) {
    return {
      id: this._id,
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: null,
    };
  }
  return {
    id: this._id,
    text: this.text,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: await authorObj.toProfileUser(user),
  };
};

module.exports = mongoose.model("Comment", commentSchema);
