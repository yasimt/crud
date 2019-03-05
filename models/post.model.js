const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema(
  {
    ucode: {
      type: Number,
      required: true,
      unique: true
    },
    post: {
      type: [
        {
          _id: {type: String, required: true},
          msg: {type: String, required: true},
          lang: {type: String}
        }
      ],
      required: true
    }
  },
  {strict: true, versionKey: false, timestamps: true}
);

module.exports = Post = mongoose.model("posts", PostSchema);
