import React from "react"
import AnswerButton from "./AnswerButton"

export default function QuizPage(props) {
    
    const answerArray = [props.value.correct_answer, ...props.value.incorrect_answers];
    //console.log(props);
    //console.log(answerArray);
    const ansObjects = answerArray.map((el, index) => {
        if (index === 0) {
            return {val: el, correct: true}
        } else {
            return {val: el, correct: false}
        }
    });
    console.log(ansObjects);
   // const buttonArrays = answerArray.map(el => <Answer is />)
    let ansTogether = '';
    for (let i = 0; i < ansObjects.length; i++) {
        ansTogether += ansObjects[i].val + ' ';
    }
    
    const arrButtons = ansObjects.map((el, index) => <AnswerButton key={index} value={el} />)
    
    return(
    
    <div>
        <p>{props.value.question}</p>
        {arrButtons}
        <hr />
    </div>)
}