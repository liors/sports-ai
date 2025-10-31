'use client';
import { useState } from 'react';

type ScoreProps = {
  tm1Score: string;
  tm2Score: string;
};

function Score({ tm1Score, tm2Score }: ScoreProps) {
  const [showScore, setShowScore] = useState(false);
  if (!tm1Score || !tm2Score) { 
    return <></>; 
  };
  return <div className="flex items-center">
    <div onClick={() => setShowScore(!showScore)} style={{ display: !showScore ? 'inline-block' : 'none' }} className="text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-pointer">Show Score</div>
    {showScore && (
      <div className="flex items-center gap-1 text-brand-blue-500">
        <span className="text-sm font-semibold dark:text-gray-400">
          {tm1Score}
        </span>
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">-</span>
        <span className="text-sm font-semibold text-gray- dark:text-gray-400">
          {tm2Score}
        </span>
      </div>
    )}
  </div>;
}

export default Score;

