const mongoose = require('mongoose')
const { Schema } = mongoose;

const employeeProfileSchema = new Schema({
    employeeId:{
        type:Number,
        default:1
    },
    name:{
        type:String,
        required:true
    },
    f_name:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date: { type: Date, default: Date.now },
});

const EmployeeProfile = mongoose.model('employeeProfile' , employeeProfileSchema)
EmployeeProfile.createIndexes();
module.exports = EmployeeProfile