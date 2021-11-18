import Band from "../models/Band.js";

export const getAllBands = async (req, res, next) => {
    const reqPage = +req.query.page || 1;
    const reqLimit = +req.query.limit || 20;

    const limit = reqLimit < 50 ? reqLimit : 50;
    const skip = (reqPage - 1) * limit;

    const bands = await Band.find().skip(skip).limit(limit);
    res.json(bands);
};
