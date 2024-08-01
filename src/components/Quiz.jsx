import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import History from './History';
import Swal from 'sweetalert2';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [unansweredQuestions, setUnansweredQuestions] = useState(0);

  const fetchQuestions = async (retries = 3, delay = 1000) => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=7&type=multiple');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.results);
        localStorage.setItem('questions', JSON.stringify(data.results));
        setLoading(false);
      } else if (response.status === 429 && retries > 0) {
        console.warn('Rate limit exceeded. Retrying...');
        setTimeout(() => fetchQuestions(retries - 1, delay * 2), delay);
      } else {
        console.error('Failed to fetch questions:', response.status);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      const cachedData = localStorage.getItem('questions');
      if (cachedData) {
        setQuestions(JSON.parse(cachedData));
        setLoading(false);
      } else {
        await fetchQuestions();
      }
    };

    loadQuestions();

    const savedState = JSON.parse(localStorage.getItem('quizState'));
    if (savedState) {
      setCurrentIndex(savedState.currentIndex || 0);
      setScore(savedState.score || 0);
      setUnansweredQuestions(savedState.unansweredQuestions || 0);
    }
  }, []);

  const onClickTimer = () => {
    setFinish(true);
    handleTimeUp(); // Memanggil handleTimeUp saat tombol "Finish" ditekan
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const question = questions[currentIndex];
    if (selectedAnswer === question.correct_answer) {
      setScore((prevScore) => prevScore + 1);
    } else if (selectedAnswer === null) {
      setUnansweredQuestions((prevUnanswered) => prevUnanswered + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
      setFinish(true); // Mengatur finish menjadi true saat kuis selesai
      const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
      quizResults.push({ 
        score: score + (selectedAnswer === question.correct_answer ? 1 : 0), 
        totalQuestions: questions.length, 
        unanswered: unansweredQuestions + (selectedAnswer === null ? 1 : 0) 
      });
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
      localStorage.removeItem('quizState');
      localStorage.removeItem('questions');
    }
  };

  const handleTimeUp = () => {
    setShowResults(true);
    setFinish(true); // Mengatur finish menjadi true saat waktu habis
    Swal.fire({
      title: "Finished",
      text: "Your quiz is finished!",
      icon: "success"
    });
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    quizResults.push({ 
      score, 
      totalQuestions: questions.length, 
      unanswered: unansweredQuestions + (questions.length - currentIndex - 1)
    });
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    localStorage.removeItem('quizState');
    localStorage.removeItem('questions');
  };

  useEffect(() => {
    const state = { currentIndex, score, unansweredQuestions };
    localStorage.setItem('quizState', JSON.stringify(state));
  }, [currentIndex, score, unansweredQuestions]);

  if (loading) return <div>Loading...</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  const question = questions[currentIndex];
  const allAnswers = [...question.incorrect_answers, question.correct_answer].sort();

  return (
    <div className="bg-gray-900 grid grid-cols-2 py-20">
      <h3 className='text-white flex items-start justify-start absolute top-3 right-5'>
        <i className="fas fa-user mr-2"></i>{localStorage.getItem('username')}
      </h3>
      <div className="my-6">
        <Timer duration={20} onFinish={handleTimeUp} finish={finish} />
        <History />
      </div>
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md my-6">
        {showResults ? (
          <div>
            <h1 className="text-white text-2xl mb-4 text-center">Quiz Results</h1>
            <p className="text-white mb-4">Correct Answers: {score}</p>
            <p className="text-white mb-4">Incorrect Answers: {questions.length - score - unansweredQuestions}</p>
            <p className="text-white mb-4">Unanswered Questions: {unansweredQuestions}</p>
            <p className="text-white mb-4">Total Questions: {questions.length}</p>
          </div>
        ) : (
          <>
            <h1 className="text-white text-2xl mb-4 text-center">
              Question {currentIndex + 1}/{questions.length}
            </h1>
            <h2 className="text-white mb-4">{question.question}</h2>
            <div className="space-y-2">
              {allAnswers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  className={`w-full p-2 rounded ${selectedAnswer === answer ? 'bg-blue-700' : 'bg-blue-500'} text-white`}
                  disabled={selectedAnswer !== null}
                >
                  {answer}
                </button>
              ))}
              <br /><br />
              <div className="flex justify-end">
                {selectedAnswer && (
                  <button onClick={currentIndex + 1 === questions.length ? onClickTimer : handleNext} className="bg-gray-200 px-5 py-2 rounded-xl font-bold">
                    {currentIndex + 1 === questions.length ? "Finish" : "Next"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
