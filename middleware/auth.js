const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (request, response, next) => {
    try {
        const token = request.cookies?.accesToken;
        
        if (!token) {
            return response.sendStatus(401);
        }
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded.id);
        request.user = user;
        next();
    } catch (error) {
        return response.sendStatus(403);
        
    }
};

module.exports = { userExtractor };