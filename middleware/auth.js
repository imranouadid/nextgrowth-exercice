module.exports = (req, res, next) => {
    let authorization = req.header("Authorization");

    if (!authorization) return res.status(401).send({
        error: "Access denied. No apikey provided"
    });

    try {
        authorization = authorization.split(' ');
        if ((authorization[0] === 'apikey') && (authorization[1] === 'AHES6ZRVmB7fkLtd1')) {
            return next();
        } else {
            return res.status(401).send({
                error: "Invalid apikey"
            });
        }
    } catch (error) {
        return res.status(401).send({
            error: "Invalid apikey"
        });
    }

}