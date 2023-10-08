const mongoose = require('mongoose')
const { Schema } = mongoose;

const adminSignUp = new Schema({
    adminId:{
        type:Number,
        default:1
    },
    // image:{
    //     type:String,
    //     required:true
    // },
    name:{
        type:String,
        require:true
    },
    phoneNo:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    date: { type: Date, default: Date.now },
});

const AdminSchema = mongoose.model('adminSchema' , adminSignUp)
AdminSchema.createIndexes();
module.exports = AdminSchema

