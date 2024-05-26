const postModel = require("../models/postModel");
const fs = require("fs");

// create post
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body; // Extracting title and description from request body
    const { photo } = req.files; // Extracting photo from request files

    // Validation: Check if title or description is missing
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // Creating a new post instance with data from request body
    const post = new postModel({
      ...req.body, // Spread the request body data
      postedBy: req.auth._id, // Assigning the postedBy field with the authenticated user's ID
    });

    // If a photo is included, read the photo data and set content type
    if (photo) {
      post.photo.data = fs.readFileSync(photo.path); // Read photo data and assign to post object
      post.photo.contentType = photo.type; // Assign content type
    }

    // Saving the post to the database
    await post.save();

    // Sending response indicating successful creation of post
    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post, // Sending the created post object in the response
    });

    console.log(req); // Logging the request object
  } catch (error) {
    // Handling any errors that occur during post creation
    console.log(error); // Logging the error
    res.status(500).send({
      success: false,
      message: "Error in Create Post API",
      error,
    });
  }
};

// GET ALL POSTS
const getAllPostsContoller = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In GETALLPOSTS API",
      error,
    });
  }
};

// get user posts
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "user posts",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in User POST API",
      error,
    });
  }
};

// delete post
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Your Post been deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in delete post api",
      error,
    });
  }
};

//UPDATE POST
const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //post find
    const post = await postModel.findById({ _id: req.params.id });
    //validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide post title or description",
      });
    }
    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post?.title,
        description: description || post?.description,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Post Updated Successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in update post api",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostsContoller,
  getUserPostsController,
  deletePostController,
  updatePostController,
};
