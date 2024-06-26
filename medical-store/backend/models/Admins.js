const mongoose=require('mongoose');
const {Schema}=mongoose

const adminSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Admins=mongoose.model('Admins',adminSchema);
module.exports=Admins;