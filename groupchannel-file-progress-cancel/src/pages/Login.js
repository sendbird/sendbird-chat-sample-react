import React, { useState } from 'react';
import SymbolImage from "../assets/sendbird_symbol.png";
import '../styles/Login.css';

function InputField({id, value, onChange, onKeyDown, label}) {
  return (
    <div className='login-input-field'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className='login-input'
      />
    </div>
  );
}

export default function Login({sb, setUserId, setIsLogin}) {
  const [idValue, setIdValue] = useState('');

  async function checkCredential() {
    setUserId(idValue);
    await connectServer(idValue);
    setIsLogin(true);
  }

  const connectServer = async (id_value) => {
    await sb.connect(id_value);
    await sb.setChannelInvitationPreference(true);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      checkCredential().then(r => console.log(r));
    }
  }

  return (
    <div className='login-container'>
      <div className='align'>
        <img src={SymbolImage} width={300} height={300} alt='Sendbird Symbol'/>
      </div>
      <InputField
        id='id'
        label='ID'
        value={idValue}
        onChange={(e) => setIdValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className='align'>
        <button className='login-button' onClick={checkCredential}>Login</button>
      </div>
    </div>
  );
}
