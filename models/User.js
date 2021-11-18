// Import mongoose
import mongoose from "mongoose";

// const Schema = mongoose.Schema;
const { Schema } = mongoose; // Destructure the Schema class

// Create a "User" schema - how should each user in the "users" collection be structured?
// This schema will be our "blueprint", or "plan", for a user document in the "users" collection
// We are creating a new instance of Mongoose's "Schema" class:

// validations - if an album does not have a title, then it is going to cause error
const userSchema = new Schema({
  // attribute: Datatype (short form)
  // e.g.
  // username: String
  // username: { type: String, required: true, validate }
  // unique - be careful with this one
  username: { type: String, required: true, unique: true, index: true },
  password: {
    type: String,
    // required: true,
    default: "password11324##$", // generating it randomly (how do we do it?)
    // extra security!!
    // hasChangedPassword: {type: Boolean, default: false},
    // remove comments below if you need to validate
    // validate: (value) => {
    //   if (value) {
    //     // This example allows non-english passwords as well
    //     const re = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
    //     return re.test(value);
    //   } else {
    //     return true;
    //   }
    // },
  },
  /*
  ! Old "albums" property example:
  [
    {title: "x", band: "y", year: 1234 },
    {title: "xa", band: "ya", year: 12345 },
  ]

  * New "albums" property
  [
    ObjectId("abcd12345678..."),
    ObjectId("efghij987654...")
  ]
  */
  albums: [{ type: mongoose.Types.ObjectId, required: true, ref: "Album" }],
});

// Hook - pre-save
function makePassword() {
  // uuid (npm package)
  const date = new Date();
  //       Number 0-9                      #%&passworD 10
  return `${Math.floor(Math.random() * 10)}#%&passworD${date.getMonth()}`;
}

// What is our problem?
/**
 * We don't want to make our first users create passwords
 */

//  this -> it doesn't work well with arrow functions
//  pre - save hook
// what to do before you save!
// <object>.<method>(variable name/attribute, <callback function>)
// profane words from username?
// pre -> before
userSchema.pre("save", function (next) {
  if (!this.password) {
    console.log("1. Before we create a random password:", this.password)
    this.password = makePassword(); // Put that complicated password generator
    console.log("2. After we create a random password:", this.password)
  }

  next();
});

// Now, we need to create and export our model.
// This will represent the "users" collection where we will save our users.

// Collection - this will automatically be made plural ("users") by MongoDB
// Schema - how documents in the collection will look
const User = mongoose.model("User", userSchema);

export default User;
