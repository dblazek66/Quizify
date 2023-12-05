const subjects =[
    " ",
    "Algebra",
    "Art",
    "Biology",
    "Chemistry",
    "Geography",
    "Geometry",
    "History",
    "Home Economics",
    "Languages",
    "Literature",
    "Math",
    "Music",
    "Philosophy",
    "Physics",
    "Science",
    "Social Studies"
  ]

const subjectSelector = document.getElementById('quizsubject')
    if(subjectSelector != null){    
    subjects.forEach((item,key)=>{
        let option = new Option(item)
        subjectSelector.appendChild(option)
    })
}


//integrate into nav mouse click
const setNavActive = (i) =>{
    const navBar = document.querySelectorAll('#quiz-nav ul li a')
    navBar.forEach((item,key)=>{
    item.classList.remove('active')
    })
    navBar[i].classList.add('active')
}

