// src/components/Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ start, stop }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (start && !stop) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (stop) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [start, stop]);

  return (
    <div className="Timer">
      <p>Time: {time} seconds</p>
    </div>
  );
};

export default Timer;
