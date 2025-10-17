const Concert = require("../models/concert.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

const addCommentsToConcert = async (req, res) => {
  try {
    const user_id = req.userId;
    const slug = req.params.slug;
    const text = req.body.text;
    const author = await User.findById(user_id);
    if (!author) {
      return res.status(404).json({ message: "Autor no encontrado", created: false });
    }
    const concert = await Concert.findOne({ slug });
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado", created: false });
    }
    const newComment = await Comment.create({
      text,
      author: author._id,
      concert: concert._id,
    });
    await concert.addComment(newComment._id);
    return res.status(200).json({ comment: await newComment.toCommentResponse(author), created: true });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar comentario", error: error.message, created: false });
  }
};

const getCommentsFromConcert = async (req, res) => {
  try {
    const slug = req.params.slug;
    const concert = await Concert.findOne({ slug }).exec();
    if (!concert) {
      return res.status(401).json({ message: "El concierto no existe" });
    }
    const loggedin = req.loggedin;
    if (loggedin) {
      const loginUser = await User.findById(req.userId).exec();
      return await res.status(200).json({
        comments: await Promise.all(
          concert.comments.map(async (commentId) => {
            const commentObj = await Comment.findById(commentId).exec();
            return await commentObj.toCommentResponse(loginUser);
          })
        ),
      });
    } else {
      return await res.status(200).json({
        comments: await Promise.all(
          concert.comments.map(async (commentId) => {
            const commentObj = await Comment.findById(commentId).exec();
            return await commentObj.toCommentResponse(null);
          })
        ),
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar comentarios", error: error.message });
  }
};

const deleteCommentFromConcert = async (req, res) => {
  const userId = req.userId;
  const author = await User.findById(userId).exec();
  if (!author) {
    return res.status(401).json({ message: "Usuario no encontrado", deleted: false });
  }
  const { slug, id } = req.params;
  const concert = await Concert.findOne({ slug }).exec();
  if (!concert) {
    return res.status(401).json({ message: "El concierto no exsiste", deleted: false });
  }
  const comment = await Comment.findOne({ _id: id });
  if (!comment) {
    return res.status(401).json({ message: "El comentario no exsiste", deleted: false });
  }
  await concert.deleteComment(comment._id);
  await Comment.deleteOne({ _id: comment._id });
  return res.status(200).json({ deleted: true });
};

module.exports = {
  addCommentsToConcert,
  getCommentsFromConcert,
  deleteCommentFromConcert,
};
