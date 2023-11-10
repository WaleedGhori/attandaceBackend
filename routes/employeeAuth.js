const express =  require('express')
const {body  , validationResult} = require('express-validator')
const router = express.Router()
const EmployeeProfile = require('../models/employeeProfile')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "waleedisagreat"
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const fetchUser = require('../middleware/fetchUser')



// ** ====== This is our employee profile creation  Routes =======
// ! Here we required authtoken to add portfolio of employees 
router.post('/employeeprofile', fetchUser, [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("f_name", "Enter a valid name").isLength({ min: 3 }),
    body("phoneNo", "Enter a valid phone no").isLength({ min: 10 }),
    body("password", "Password should be at least 8 characters").isLength({ min: 8 }),
    body("role", "Enter a valid role").isIn(['admin', 'employee']), // Validate that the role is either 'admin' or 'employee'
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);

        const maxInvoiceNumberUser = await EmployeeProfile.findOne({}, { employeeId: 1 }, { sort: { employeeId: -1 } });
        const nextInvoiceNumber = maxInvoiceNumberUser ? maxInvoiceNumberUser.employeeId + 1 : 1;

        let employee = await EmployeeProfile.create({
            employeeId: nextInvoiceNumber,
            name: req.body.name,
            f_name: req.body.f_name,
            phoneNo: req.body.phoneNo,
            password: securePass,
            role: req.body.role, // Set the role from the request body
        });

        const data = {
            employee: {
                id: employee.employeeId,
                role: employee.role,
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        if (authToken) {
            res.json({authToken:authToken, success: true, message: "User added successfully" });
        }
    } catch (error) {
        res.status(500).send("Some error occurred");
    }
});

module.exports = router