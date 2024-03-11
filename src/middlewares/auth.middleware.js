export const authMiddleware = (roles) => {
    return async(req, res, next) => {
        const user = await req.user
        const rol = user.role
        if (roles.includes(rol)) {
            return next();
        }
        if (!roles.includes(rol)) {
            return res.status(403).json("Not authorized");
        }
        next();
    }
}