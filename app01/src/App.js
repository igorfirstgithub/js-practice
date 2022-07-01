import React from "react"
import QuizPage from "./QuizPage"

export default function App() {
    
    const startArray = [];
    const [selectPage, setSelectPage] = React.useState(false);
    const [quizData, setQuizData] = React.useState([]);
        
    for (let i = 0; i < 3; i++) {
        startArray.push(i+1);
    }
    
    const quizArray = quizData.map( (el, index) => <QuizPage key={index} value={el}  /> )
        
    function changePage() {
        setSelectPage(prevPage => !prevPage);
        
        fetch("https://opentdb.com/api.php?amount=3&category=19&difficulty=easy&type=multiple").
        then(res => res.json()).
        then(res => setQuizData(res.results));
        
        
    }
    
    
    if (!selectPage) { // Start page
        return (
            <div>
                <h1>Qizzical</h1>
                <p>Some description</p>
                <button type="button" onClick={changePage}>Start quiz</button>
            </div>
            )
    } else {            // Quiz page
        return (
            <div>
                {quizArray}
                <button type="button">Submit answers</button>
            </div>
        )
    }
}