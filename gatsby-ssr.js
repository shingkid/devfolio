const React = require('react');

// Apply the saved terminal theme before first paint to avoid a flash.
exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    React.createElement('script', {
      key: 'theme-init',
      dangerouslySetInnerHTML: {
        __html: `document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`,
      },
    }),
  ]);
};
