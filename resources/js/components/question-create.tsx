import React from 'react';

interface Topic {
  id: number;
  name: string;
}

interface QuestionCreateProps {
  topics: Topic[];
}

const QuestionCreate: React.FC<QuestionCreateProps> = ({ topics }) => {
  return (
    <div>
      <h1>Create New Question</h1>
      <select>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>
      <button onClick={() => alert('Question created!')}>Submit</button>
    </div>
  );
};

export default QuestionCreate;