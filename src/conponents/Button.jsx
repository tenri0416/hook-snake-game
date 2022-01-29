import React from 'react';

export const Button = ({ onRestart, start, startNow, onStop }) => {
  return (
    <div className="button">
      {start === "gameover" && <button className="btn btn-gameover" onClick={onRestart}>gameover</button>}
      {start === "init" && <button className="btn btn-init" onClick={startNow}>start</button>}
      {start === "stop" && <button className="btn btn-suspended" onClick={startNow}>start</button>}
      {start === "playnow" && <button className="btn btn-playing" onClick={onStop}>stop</button>}

    </div >
  );
};

