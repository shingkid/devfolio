import React from 'react';

const Layout = ({ children }) => {
  const [login, setLogin] = React.useState('Last login: janeseah.com');

  React.useEffect(() => {
    const now = new Date();
    setLogin(
      `Last login: ${now.toDateString()} ${now.toTimeString().slice(0, 8)} on ttys000`
    );
  }, []);

  return (
    <div className="term">
      <p className="term-motd">{login}</p>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
