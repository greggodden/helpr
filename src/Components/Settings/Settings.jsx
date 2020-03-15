import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './settings.css';

const Settings = () => {
  // SET INITIAL STATES
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const isHelpr = useSelector(state => state.isHelpr);
  const userId = useSelector(state => state.userId);
  const history = useHistory();

  // ON COMPONENT DID MOUNT
  useEffect(() => {
    getData(isHelpr);
  }, []);

  // RETRIEVE HELPR DATA
  const getData = async isHelpr => {
    const data = new FormData();
    data.append('isHelpr', isHelpr);
    data.append('_id', userId);
    const response = await fetch('/getData', { method: 'POST', body: data });
    let body = await response.text();
    body = JSON.parse(body);
    console.log('response body: ', body);
  };

  return (
    <>
      {!isLoggedIn && history.push('/login')}
      {!isHelpr && history.push('/')}
      <section>
        <div className='content container'>HERE BE SETTINGS</div>
      </section>
    </>
  );
};

export default Settings;
