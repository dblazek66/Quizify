const mongoose = require('mongoose');
const Schema = mongoose.Schema


const quizSchema = new Schema({
    quizdesc:{
        type:String
    },
    quizmodule:{
        type:String
    },
    quizname:{
        type:String,
        required:true
    },
    quizsubject:{
        type:String
    },
    quizuser:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

}, { timestamps:true});

const Quiz = mongoose.model('QuizName',quizSchema);
module.exports = Quiz;