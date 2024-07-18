import React from 'react';

// import * as Assets from '@video-cv/assets';

const LogoutModal = ({
  onClose,
  onLogout,
}: {
  onClose: () => void;
  onLogout: () => void;
}) => {
  return (
    <div className="bg-white p-10 lg:p-14 centered-modal">
      <div className="flex flex-col items-center space-y-4">
        {/* <img src={Assets.Icons.LogoutModalIcon} alt="confirm icon" /> */}

        <p className="text-center">Are you sure you want to logout?</p>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="ce-btn-text"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>

          <button className="ce-btn !bg-[#D8304A]" onClick={() => onLogout()}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
