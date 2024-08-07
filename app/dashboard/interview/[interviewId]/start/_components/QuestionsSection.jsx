import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestinIndex }) {

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text to speech.');
    }
  }

  return mockInterviewQuestion && (
    <div className='p-5 my-10 border rounded-lg'>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
        {mockInterviewQuestion.map((question, index) => (
          <h2
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer 
            ${activeQuestinIndex === index ? 'bg-indigo-500 text-white' : 'bg-secondary'}`}
            key={index}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      <h2 className='my-5 text-sm md:text-lg'>{mockInterviewQuestion[activeQuestinIndex]?.question}</h2>
      
      <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQuestion[activeQuestinIndex]?.question)} />
      
      <div className='border rounded-lg p-5 bg-blue-100 text-primary mt-20'>
        <h2 className='flex gap-2 items-center'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
