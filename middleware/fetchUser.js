var jwt = require('jsonwebtoken');
const JWT_SECRET = 'waleedisagreat';

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id and role to req object
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.employee; // Assuming the user data is stored in the 'employee' property

        // if(!req.user.role.includes('admin')) return res.status(403).send({ error: "Unauthorized: Insufficient role permissions" });
        
        // Check if the user has the required role
         const requiredRole = 'admin'; // Set the required role (you can fetch it from your route or middleware)
        if (data.employee.role !== requiredRole) {
             return res.status(403).send({ error: "Unauthorized: Insufficient role permissions" });
         }

        next();
    } catch (error) {
        res.status(401).send({ error: "Some error occurred" });
    }
}

module.exports = fetchUser;
