'use client';

import { useState } from 'react';

import Login from './login/Login';
import SignUp from './signup/SignUp';
import MailVerification from './mailVerification/MailVerfication';

// ----------------------------------------------------------------------

interface LoginPopupProps {
  open: boolean;
  title?: string | undefined;
  description?: string | undefined;
  onClose: () => void;
}

const LoginPopup = ({ open, onClose, title, description }: LoginPopupProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <>
      {!isSignup ? (
        <Login
          open={open}
          isSignup={isSignup}
          setIsSignup={setIsSignup}
          onClose={onClose}
          setIsEmailVerification={setIsEmailVerification}
          setUserEmail={setUserEmail}
          title={title}
          description={description}
        />
      ) : (
        <>
          {!isEmailVerification ? (
            <SignUp
              open={open}
              isSignup={isSignup}
              setIsSignup={setIsSignup}
              onClose={onClose}
              setIsEmailVerification={setIsEmailVerification}
              setUserEmail={setUserEmail}
            />
          ) : (
            <MailVerification
              onClose={onClose}
              open={open}
              setIsEmailVerification={setIsEmailVerification}
              setIsSignup={setIsSignup}
              setUserEmail={setUserEmail}
              userEmail={userEmail}
            />
          )}
        </>
      )}
    </>
  );
};

export default LoginPopup;
