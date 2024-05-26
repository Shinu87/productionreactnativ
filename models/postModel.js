const mongoose = require("mongoose");

// Define the schema for the post
const postSchema = new mongoose.Schema(
  {
    // Title of the post
    title: {
      type: String, // Data type: String
      required: [true, "please add post title"], // Title is required with a custom error message
    },
    // Description of the post
    description: {
      type: String, // Data type: String
      required: [true, "please add post description"], // Description is required with a custom error message
    },
    // Photo associated with the post
    photo: {
      data: Buffer, // Data type: Buffer to store binary data
      contentType: String, // Data type: String to store the MIME type
    },
    // User who posted the post
    postedBy: {
      type: mongoose.Schema.ObjectId, // Reference to another schema (User)
      ref: "User", // The model to use for population
      required: true, // postedBy is required
    },
  },
  // Options for the schema
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the Post model based on the schema
module.exports = mongoose.model("Post", postSchema);
