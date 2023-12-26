import React from 'react';

import './messageBox.css';
import AppIconButton from '../../components/AppIconButton/AppIconButton';
import { useAppStore } from '../../store/app';

const MessageBox = ({ onInputChange, message, handleSendMessage }) => {
  const [state] = useAppStore();

  return (
    <form onSubmit={(e) => handleSendMessage} className="message-box">
      <input
        type="text"
        value={message}
        onChange={(e) => onInputChange(e.target.value)}
        className="custom-input"
        placeholder="Type Message here..."
        style={{
          color: state?.darkMode ? 'white' : 'black',
        }}
      />
      <AppIconButton
        type="submit"
        color={'primary'}
        icon={'send'}
        onClick={handleSendMessage}
        variant
        className={'send-button'}
      />
    </form>
  );
};

export default MessageBox;
