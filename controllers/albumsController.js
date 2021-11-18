import createError from "http-errors";

import User from "../models/User.js";
import Album from "../models/Album.js";

// POST /albums
//     body: {
//         userId: "",
//         title: "",
//         band: "",
//         year: "",
//     }
export const createAlbum = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.body.userId);

        if (!currentUser) return next(createError.Unauthorized());

        const existingAlbum = await Album.findOne({
            title: req.body.title,
            band: req.body.band,
        });

        if (existingAlbum) return res.status(200).json(existingAlbum._id);

        const newAlbum = new Album({
            title: req.body.title,
            band: req.body.band,
            year: req.body.year,
        });

        const response = await newAlbum.save();

        res.status(201).json(response._id);
    } catch (error) {
        console.log(error);
        next(createError.InternalServerError());
    }
};