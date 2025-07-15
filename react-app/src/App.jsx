import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormView from "./components/FormView";
import ResultView from "./components/ResultView";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);
  const [score, setScore] = useState(0);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <FormView
              onGrade={(data) => {
                setScore(data.score);
                setAnswerResults(data.results);
                setQuestions(data.questions);
              }}
            />
          }
        />
        <Route
          path="/result"
          element={
            <ResultView
              score={score}
              total={questions.length}
              answers={answerResults}
            />
          }
        />
      </Routes>
    </Router>
  );
}
