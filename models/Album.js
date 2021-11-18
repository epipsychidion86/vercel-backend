// Import mongoose
import mongoose from "mongoose";

// const Schema = mongoose.Schema;
const { Schema } = mongoose; // Destructure the Schema class

// Let's create an "Album" schema - how should an Album be structured?
const albumSchema = new Schema({
    // You can define ATTRIBUTES for each property in the schema, for example:
    //  - what should the data type be?
    //  - is it required for the property to have a value?
    //  - should the property's value be unique?
    title: { type: String, required: true },
    band: { type: String, required: true},
    year: { type: Number, required: true },
    // A list of _ids of the USERS who added this album to their "albums" list
    // * The "ref" attribute allows us to create a connection between the Album schema and the User schema
    // We will use "ref" to help with a process called "population" - this will make more sense soon!
})

// Create and export the "Album" model
const Album = mongoose.model("Album", albumSchema);

export default Album;
