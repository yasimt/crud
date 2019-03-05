const _ = require("lodash");

const {isEmpty, trimObj} = require("../utility/helper");
const asyncMiddleware = require("../utility/async");

const Post = require("../models/post.model");

//http://localhost:8686/api/post/4
exports.getPost = asyncMiddleware(async function(req, res) {
  let qry = {};
  let id = 0;
  if (!isEmpty(req.params.id)) {
    qry = {"post._id": req.params.id};
    id = req.params.id;
  }

  let oldPost = await Post.find(qry);
  if (oldPost && Object.keys(oldPost).length > 0) {
    oldPost = JSON.parse(JSON.stringify(oldPost));

    if (id > 0) {
      oldPost = oldPost[0].post.filter(x => {
        return x._id == id;
      });
    }

    return res.status(200).json({error: 0, msg: oldPost});
  } else {
    return res.status(200).json({error: 1, msg: "post not found"});
  }
});

// @url   http://localhost:8686/api/post/create
/*{
	"ucode" : "10000760",
	"post" :[
		{
			"_id" : 1,
			"msg" : "First Message"
		},
		{
			"_id" : 2,
			"msg" : "Second Message - 2",
			"lang" : "English"
		}

		]
}*/

exports.createPost = asyncMiddleware(async function(req, res) {
  //Removing Spaces
  req.body = trimObj(req.body);

  // Check Validation
  if (isEmpty(req.body.ucode)) {
    return res.status(400).json({error: 1, msg: "ucode is blank"});
  }

  if (isEmpty(req.body.post)) {
    return res.status(400).json({error: 1, msg: "post is blank"});
  }

  if (!Array.isArray(req.body.post)) {
    return res.status(400).json({error: 1, msg: "please pass array of posts"});
  }

  const ucode = req.body.ucode;
  const post = req.body.post;

  let error = 0;
  let idarr = [];
  post.map((val, key) => {
    idarr.push(parseInt(val._id));
    if (isEmpty(val._id) || isEmpty(val.msg)) {
      error = 1;
      return false;
    }
  });

  let uniqarr = _.uniq(idarr);

  if (idarr.length !== uniqarr.length) {
    return res.status(400).json({error: 1, msg: "id in post must be unique"});
  }

  if (error === 1) {
    return res.status(400).json({error: 1, msg: "post must have id & msg"});
  }

  try {
    const updatePost = await Post.updateOne(
      {},
      {post: post},
      {upsert: true, runValidators: true}
    );
    if (Object.keys(updatePost).length > 0) {
      return res.status(200).json({error: 0, msg: "post updated"});
    } else {
      return res.status(200).json({error: 1, msg: "post not updated"});
    }
    /*
    const postdata = new Post({
      ucode,
      post
    });
    await postdata.save();
    */
  } catch (e) {
    return res.status(500).json({error: 1, msg: e.message});
  }
});

//http://localhost:8686/api/post/update/3
exports.updatePost = asyncMiddleware(async function(req, res) {
  if (isEmpty(req.params.id)) {
    return res.status(400).json({error: 1, msg: "id is blank"});
  }

  if (isEmpty(req.body.post)) {
    return res.status(400).json({error: 1, msg: "post is blank"});
  }
  const id = req.params.id;
  const post = req.body.post;

  let updatePost = {};

  const oldPost = await Post.findOne({"post._id": id});
  if (oldPost && Object.keys(oldPost).length > 0) {
    updatePost = await Post.updateOne(
      {"post._id": id},
      {$set: {"post.$": {_id: id, msg: post}}},
      {upsert: true, runValidators: true}
    );
  } else {
    updatePost = await Post.updateOne(
      {},
      {$push: {post: {_id: id, msg: post}}},
      {upsert: true, runValidators: true}
    );
  }

  /*updatePost = await Post.updateOne(
    {},
    {$addToSet: {post: {_id: id, msg: post}}},
    {upsert: true, runValidators: true}
  );*/
  // on duplicate update only if all data inside obj are same (here _id and msg)

  if (Object.keys(updatePost).length > 0) {
    return res.status(200).json({error: 0, msg: "post updated"});
  } else {
    return res.status(200).json({error: 1, msg: "post not updated"});
  }
});

//http://localhost:8686/api/post/delete/3
exports.deletePost = asyncMiddleware(async function(req, res) {
  if (isEmpty(req.params.id)) {
    return res.status(400).json({error: 1, msg: "id is blank"});
  }

  const id = req.params.id;

  const oldPost = await Post.findOne({"post._id": id});
  if (oldPost && Object.keys(oldPost).length > 0) {
    const updatePost = await Post.updateOne(
      {},
      {$pull: {post: {_id: id}}},
      {upsert: true, runValidators: true}
    );
    if (Object.keys(updatePost).length > 0) {
      return res.status(200).json({error: 0, msg: "post updated"});
    } else {
      return res.status(200).json({error: 1, msg: "post not updated"});
    }
  } else {
    return res
      .status(200)
      .json({error: 1, msg: "post not found with given id"});
  }
});
