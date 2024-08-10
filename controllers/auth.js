const User = require('../models/User');
const {StatusCodes} = require("http-status-codes")
const CustomAPIError = require('../errors/custom-api');

const signup = async (req, res) => {
    const user = await User.create({...req.body})

    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({
        successful: 'true',
        user: {name: user.name},
        token,
    });
}
const login =async (req, res) => {
    const {email,password} = req.body

    if (!email || !password) {
        throw new CustomAPIError('you must provide an email and password',StatusCodes.BAD_REQUEST);
    }

    const user = await User.findOne({email})
    if (!user) {
        throw new CustomAPIError('user does not exist',StatusCodes.UNAUTHORIZED);
    }

    const correctPassword = await user.comparePassword(password)
    if (!correctPassword) {
        throw new CustomAPIError('password is incorrect',StatusCodes.UNAUTHORIZED);
    }

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({
        success: true,
        user:{name: user.name},
        token
    })
}

module.exports = {signup, login}