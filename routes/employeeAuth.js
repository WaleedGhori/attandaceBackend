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
router.post('/employeeprofile'  , fetchUser , [
    body("name", "Enter a valid name").isLength({min:3}),
    body("f_name", "Enter a valid name").isLength({min:3}),
    body("phoneNo", "Enter a valid phone no").isLength({min:10}),
    body("password", "Password should be atleast 8 characters").isLength({min:7}),
] ,async(req ,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const salt = await bcrypt.genSalt(10) //? we generate salt here
        const securePass = await bcrypt.hash(req.body.password , salt) //? we generate hash of password and then add salt with password
        
        //? Find the maximum employeeId number currently in the collection
         const maxInvoiceNumberUser = await EmployeeProfile.findOne({}, { employeeId: 1 }, { sort: { employeeId: -1 } });

        //? Calculate the next invoice number
        const nextInvoiceNumber = maxInvoiceNumberUser ? maxInvoiceNumberUser.employeeId + 1 : 1;
       
        //? here we crearte a user
        let employee = await EmployeeProfile.create({ 
            employeeId: nextInvoiceNumber,
            name: req.body.name,
            f_name: req.body.f_name,
            phoneNo: req.body.phoneNo,
            password: securePass,
        })
        /*//? we want to send some response to the user so we make a data object nested by user where we take id from user which is created
          //? because we sign the data from jwt_Secret and send authToken to the newly created user */
        const data = {
          employee:{
                id:employee.employeeId
            }
        }
        const authToken = jwt.sign(data , JWT_SECRET) 
        if (authToken) {
            res.json({success:true, message:"Employee added successfully"})
        }
    } catch (error) {
        res.status(500).send("Some error Occured")
    }
})

module.exports = router