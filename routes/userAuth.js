const express =  require('express')
const {body  , validationResult} = require('express-validator')
const router = express.Router()
const AdminSchema = require('../models/admin')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "waleedisagreat"
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const fetchUser = require('../middleware/fetchUser')



// ** ====== This is our signUp Routes =======
// ! Here we required authtoken to create another user 
router.post('/signup'  , [
    body("name", "Enter a valid name").isLength({min:3}),
    body("phoneNo", "Enter a valid phone no").isLength({min:10}),
    body("password", "Password should be atleast 8 characters").isLength({min:7}),
] ,fetchUser,async(req ,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const salt = await bcrypt.genSalt(10) //? we generate salt here
        const securePass = await bcrypt.hash(req.body.password , salt) //? we generate hash of password and then add salt with password
        
        //? Find the maximum adminNo number currently in the collection
         const maxInvoiceNumberUser = await AdminSchema.findOne({}, { adminId: 1 }, { sort: { adminId: -1 } });

        //? Calculate the next invoice number
        const nextInvoiceNumber = maxInvoiceNumberUser ? maxInvoiceNumberUser.adminId + 1 : 1;
       
        //? here we crearte a user
        let admin = await AdminSchema.create({ 
            adminId: nextInvoiceNumber,
            name: req.body.name,
            phone: req.body.phone,
            password: securePass,
        })
        /*//? we want to send some response to the user so we make a data object nested by user where we take id from user which is created
          //? because we sign the data from jwt_Secret and send authToken to the newly created user */
        const data = {
            admin:{
                id:admin.adminId
            }
        }
        const authToken = jwt.sign(data , JWT_SECRET) 
        res.json({authToken})
    } catch (error) {
        res.status(500).send("Some error Occured")
    }
})


// ** ====== This is our login Routes =======
router.post(
    "/login",
    [
      body("name", "Enter a valid username").exists({ min: 3 }),
      body("password", "Password cannot be blank").exists({ min: 7 }),
    ],
    async (req, res) => {
      let success = false;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, password } = req.body;
      try {
        let admin = await AdminSchema.findOne({ name });
        if (!admin) {
          success = false;
          return res
            .status(400)
            .json({ error: "Please try to login with correct credentials" });
        }
        //! Here we first bcypt password  and then we take password from person and from database if password are equals we will perform
        //! are logic
        const passwordCompare = await bcrypt.compare(password, admin.password);
        if (!passwordCompare) {
          success = false;
          return res.status(400).json({
            success,
            error: "Please try to login with correct credentials",
          });
        }
        const data = {
          admin: {
            id: admin.id,
          },
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );
  
module.exports = router