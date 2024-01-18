import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { userIdStore } from '../store/store';
import { PutProfile } from '../pages/setting/SettingAPI';

export default function ChangeProfileModal({ isOpen, onClose }) {
    const { userName, userEmail,userPassword,setUserName,setUserEmail,setUserPassword } = userIdStore();
    const [name, setName] = React.useState(userName);
    const [email, setEmail] = React.useState(userEmail);
    const [password, setPassword] = React.useState(userPassword);
    const [passwordAgain, setPasswordAgain] = React.useState('');
    const [isPasswordValid, setIsPasswordValid] = React.useState(true);
    const [isPasswordMatching, setIsPasswordMatching] = React.useState(true);
    
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        const isLengthValid = newPassword.length >= 8 && newPassword.length <= 20;
        const isComplexityValid =
        /[0-9]/.test(newPassword) && /[a-zA-Z]/.test(newPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        setIsPasswordValid(isLengthValid && isComplexityValid);
    };

    const handlePasswordAgainChange = (event) => {
        const newPasswordAgain = event.target.value;
        setPasswordAgain(newPasswordAgain);
        setIsPasswordMatching(newPasswordAgain === password);
    };

    const handleSubmit = () => {
        if (isPasswordValid && isPasswordMatching) {
        PutProfile(email,password,name);
        setUserEmail(email);
        setUserName(name);
        setUserPassword(password);
        onClose();
        } else {
        console.error('유효하지 않은 비밀번호 또는 비밀번호 불일치!');
        }
    };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="mx-auto w-[50%] h-[30rem] bg-white rounded-[20px] shadow-xl border-2 border-blue-400 p-4">
            <p>회원 정보 수정</p>
          <form>
            <div>
              <div className="w-full text-gray-500 text-sm">Name</div>
              <input
                className="w-[90%] h-11 mx-4 my-1 px-4 border-2 border-blue-400 rounded-lg text-xs shadow-xl focus:outline-blue-500"
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div>
              <label htmlFor="Email" className="w-full text-gray-500 text-sm">
                Email
              </label>
              <input
                className="w-[90%] h-11 mx-4 my-1 px-4 border-2 border-blue-400 rounded-lg text-xs shadow-xl focus:outline-blue-500"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="Password" className="w-full text-gray-500 text-sm">
                Password
              </label>
              <input
                className={`w-[90%] h-11 mx-4 my-2 px-4 border-2 border-blue-400 rounded-lg text-xs shadow-xl focus:outline-blue-500 ${
                  !isPasswordValid ? 'border-red-500' : ''
                }`}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {!isPasswordValid && (
              <p className="text-red-500 text-xs mx-4 my-1">
                Password must be 8-20 characters and include at least two of the following: numbers, letters, special
                characters.
              </p>
            )}
            <div>
              <label htmlFor="PasswordAgain" className="w-full text-gray-500 text-sm">
                Password again
              </label>
              <input
                className={`w-[90%] h-11 mx-4 my-1 px-4 border-2 border-blue-400 rounded-lg text-xs shadow-xl focus:outline-blue-500 ${
                  !isPasswordMatching ? 'border-red-500' : ''
                }`}
                type="password"
                placeholder="Enter password again"
                value={passwordAgain}
                onChange={handlePasswordAgainChange}
              />
              {!isPasswordMatching && <p className="text-red-500 text-xs mx-4 my-1">Passwords do not match.</p>}
            </div>
            <button
              className="bg-[#0096FB] rounded-md shadow-lg text-white px-4 py-1 mx-4 mt-4 w-[90%] h-11 ${isPasswordValid && isPasswordMatching ? '' : 'cursor-not-allowed'}"
              onClick={handleSubmit}
            >
              회원 정보 수정하기
            </button>
          </form>
        </div>
      </div>
    )
  );
}
