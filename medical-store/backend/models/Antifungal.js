const mongoose=require('mongoose');
const {Schema}=mongoose;

const antifungalMedSchema=new Schema({
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admins'
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

const AntifungalMed=mongoose.model('Antifungal',antifungalMedSchema);
module.exports=AntifungalMed;