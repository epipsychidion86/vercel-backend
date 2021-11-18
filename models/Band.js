import mongoose from "mongoose";

const { Schema } = mongoose;

const bandSchema = new Schema({
    name: { type: String, required: true },
    index: Number,
})

const Band = mongoose.model("Band", bandSchema);

export default Band;
