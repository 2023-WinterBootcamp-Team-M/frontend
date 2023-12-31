import React, { useState } from 'react';

const ThemeToggle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);

    const htmlEl = document.querySelector('html');
    if (!htmlEl) return;

    if (isDarkTheme) {
      htmlEl.classList.remove('dark');
    } else {
      htmlEl.classList.add('dark');
    }
  };

  const Icons = {
    darkTheme: 'https://i.ibb.co/mNXCmNb/free-icon-night-2007907.png',
    lightTheme: 'https://i.ibb.co/mGwtxDj/free-icon-sun-5497432.png',
  };

  return (
    <button onClick={toggleTheme} className="flex items-center text-gray-700 cursor-pointer mt-4 text-[1.2rem]">
      <img
        src={isDarkTheme ? Icons.lightTheme : Icons.darkTheme}
        alt="Theme Icon"
        style={{ width: '20px', height: '20px', marginRight: '8px' }}
      />
      {isDarkTheme ? '밝은 테마' : '어두운 테마'}
    </button>
  );
};

export default ThemeToggle;
