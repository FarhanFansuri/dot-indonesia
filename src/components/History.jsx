import React from 'react';

const History = () => {
  const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];

  return (
    <div className="bg-gray-900 flex items-center justify-center my-10">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md no-scrollbar overflow-y-scroll h-56">
        <h1 className="text-white text-2xl mb-4 text-center">Quiz History</h1>
        {quizResults.length === 0 ? (
          <p className="text-white text-lg text-center">No quiz results found.</p>
        ) : (
          <ul className="space-y-4">
            {quizResults.map((result, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded-lg shadow-md text-white">
                <h2 className="text-xl mb-2">Quiz {index + 1}</h2>
                <p>Correct Answers: {result.score}</p>
                <p>Incorrect Answers: {result.totalQuestions - result.score - result.unanswered}</p>
                <p>Unanswered Questions: {result.unanswered}</p>
                <p>Total Questions: {result.totalQuestions}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default History;
