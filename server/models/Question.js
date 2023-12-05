const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    imagename:String,
    mcoptionA:String,
    mcoptionB:String,
    mcoptionC:String,
    mcoptionD:String,
    mcoptionE:String,
    
    quizid:{
        type:Schema.Types.ObjectId,
        ref:'Quiz'
    }

}, { timestamps:true});


const Question = mongoose.model('question',questionSchema);
module.exports = Question;