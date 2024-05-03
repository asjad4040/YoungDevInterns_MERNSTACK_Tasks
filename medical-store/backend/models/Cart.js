const mongoose=require('mongoose');
const {Schema}=mongoose;

const CartSchema=new Schema({
    userCart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    unitPrice:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },

});

const UserCart=mongoose.model('Cart',CartSchema);
module.exports=UserCart;