import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');

  const setLocalUsername = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <UserContext.Provider value={{ username, setLocalUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
