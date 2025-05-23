// Importing the required modules from Mongoose
const {Schema,model} = require("mongoose");

// Defining the schema for the "User" collection
const userSchema = new Schema({
    username: {
        type: String, // Specifies that the value should be a string
        required: true, // Makes this field mandatory
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    });

    // Creating a Mongoose model named "User"
    // The third argument "users" explicitly sets the collection name in MongoDB
    module.exports=model("User",userSchema,"users")