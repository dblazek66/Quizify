const express = require('express');
const router = express.Router()
const { get, set } = require("node-global-storage");
const User = require('../models/User')
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;


const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try {
        const decoded = jwt.verify(token,jwtSecret)
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({message: "Unauthorized"})
    }
}

router.get('/',(req,res)=>{
    const locals={
        title:"Login"
    }
    
    res.render("index",locals);
});

router.post('/login', async (req,res)=>{
    const locals={
        title:"List of Quizzes"
    }
    
    try {
        const {username,password} = req.body
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json( {message: 'Invalid credentials 1'} )
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json( {message: 'Invalid credentials 2'} )
        }
        //store user id for future queries
        set("current_user_id", user._id, { protected: true });
        const token = jwt.sign({userId:user._id},jwtSecret)
        
        res.cookie('token',token, { httpOnly:true})
        locals["userid"] = user._id
        try {
            const data = await Quiz.find({quizuser:get("current_user_id")});
            res.render("quiz-list",{locals,data}) 
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
    
})

///Render Register Page
router.get('/register',(req,res)=>{
    const locals={
        title:"Register"
    }
    res.render("register",locals)
})

//Process Register Page
router.post('/register', async (req,res) => {
    try {
        const {username,password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({username,password:hashedPassword})
           // res.status(201).json({message:'User Created', user})
            res.redirect('/')
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message:'Username  already in use'})
            }
            res.status(500).json({message:"Internal Server error"})
        }

    } catch (error) {
        console.log(error)
    }
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/')
})

router.get('/quiz-list/', async (req,res)=>{
    const locals={title:"Quiz"}
    try {
        const data = await Quiz.find({quizuser:get("current_user_id")});
        res.render("quiz-list",{locals,data}) 
    } catch (error) {
        console.log(error)
    }
})

router.get('/quiz-create',(req,res)=>{
    const locals={title:"Create New Quiz"}
    res.render("quiz-create",locals)
})

router.post('/quiz-create', async (req,res)=>{
    try {
        try {
            const newQuiz = new Quiz({
                quizuser: get("current_user_id"),
                quizdate: req.body.quizdate,
                quizdesc: req.body.quizdesc,
                quizmodule: req.body.quizmodule,
                quizname: req.body.quizname,
                quizsubject: req.body.quizsubject
            });
            
            await Quiz.create(newQuiz);
            res.redirect('/quiz-list')
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
})


router.get('/quest-list/:id', async (req,res)=>{
    const quizid = req.params.id
    const questions = await Question.find({quizid: quizid})
    const quiz = await Quiz.find({_id:quizid})
    const locals={title:"Questions"}
    res.render("quest-list",{locals,quizid,questions,quiz})
})


//render quested create screen
router.get('/quest-create/:id',(req,res)=>{
    const quizid = req.params.id
    const locals={title:"Create new Question"}
    res.render("quest-create",{locals,quizid})
})

//create new question
router.post('/quest-create/:id', async(req,res)=>{
    try {
        const locals={title:"Create new Question"}
        const newQuestion = new Question({
            question: req.body.question,
            answer: req.body.answer,
            imagename: req.body.imagename,
            mcoptionA: req.body.mcoptionA,
            mcoptionB: req.body.mcoptionB,
            mcoptionC: req.body.mcoptionC,
            mcoptionD: req.body.mcoptionD,
            mcoptionE: req.body.mcoptionE,
            quizid: req.params.id
        })
        await Question.create(newQuestion);
        //res.render(`/quest-list/${req.params.id}`,{locals,quizid: req.params.id})  
        res.redirect(`/quest-list/${req.params.id}`)
    } catch (error) {
        console.log(error)
    }
  
})

router.get('/quest-edit/:id',async (req,res)=>{
       const id = req.params.id
    const locals={title:"Edit Question"}
    const question = await Question.findById(id)
    res.render("quest-edit",{locals,question})
});

router.put('/quest-edit/:id', async (req,res)=>{
    try {
        await Question.findByIdAndUpdate(req.params.id,{
            question: req.body.question,
            answer: req.body.answer,
           imagename: req.body.imagename,
            mcoptionA: req.body.mcoptionA,
            mcoptionB: req.body.mcoptionB,
            mcoptionC: req.body.mcoptionC,
            mcoptionD: req.body.mcoptionD,
            mcoptionE: req.body.mcoptionE,
            quizid: req.params.quizid,
            updatedAt: Date.now()
        })
        res.redirect(`/quest-list/${req.body.quizid}`)
    } catch (error) {
        console.log(error)
    }
});

router.delete('/quest-edit/:id', async (req,res)=>{
    try {
        await Question.deleteOne({ _id: req.params.id})
        res.redirect(`/quest-list/${req.body.quizid}`)
    } catch (error) {
        console.log(error)
    }
});



module.exports = router;