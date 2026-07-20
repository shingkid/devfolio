import React from 'react';

import Cat from '../cat';

// The whole transcript lives inside one terminal window; the pixel cats
// float over the page as a movable pet, parked bottom-right by default.
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
      <Cat />
      <div className="terminal-wrap">
        <div className="terminal">
          <div className="terminal-chrome">
            <span className="terminal-dot" aria-hidden="true" />
            <span className="terminal-path">jane@sgp — portfolio</span>
            <span className="terminal-status">session active</span>
          </div>
          <div className="terminal-body">
            <p className="term-motd">{login}</p>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
