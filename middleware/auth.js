// we use middleware to ensure that the user had signin when he wants to like or comment a post.

const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        decodedData = jwt.decode(token);
        req.userId = decodedData?.sub;
        console.log('dddddd', decodedData?.sub, 'sss', req?.headers?.theId);
        next(); // go to the next step

    } catch (error) {
        console.log(error?.message);
    }
}
module.exports = {auth};
