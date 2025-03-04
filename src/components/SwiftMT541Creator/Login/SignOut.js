import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { signOut } from '../../../services/api';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    Swal.fire({
      title: 'Signed Out',
      text: 'You have been signed out successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/login'); // Redirect to login page after sign out
    });
  };

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
