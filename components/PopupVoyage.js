import React from 'react';

const PopupVoyage = ({ trigger, setTrigger, children }) => {
  return trigger ? (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-xl h-4/5 bg-white flex flex-col items-center justify-center rounded-lg border-4 border-white shadow-lg">
        <button
          className="absolute right-2 top-2 cursor-pointer w-1/6 p-2  text-white rounded-full"
          onClick={() => setTrigger(false)}
        >
          X
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

export default PopupVoyage;
