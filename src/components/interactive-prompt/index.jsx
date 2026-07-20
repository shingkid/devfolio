import get from 'lodash/get';
import React from 'react';

import { PROMPT, Prompt } from '../terminal';

const FILES =
  'about.txt  education.log  hobbies.txt  links/  projects/  research.md  resume.pdf';

const setTheme = (mode) => {
  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', mode);
  }
  try {
    if (mode === 'auto') localStorage.removeItem('theme');
    else localStorage.setItem('theme', mode);
  } catch (e) {
    // private mode: theme just won't persist
  }
};

// A real prompt at the end of the transcript. Try `help`.
const InteractivePrompt = ({ metadata = {} }) => {
  const [log, setLog] = React.useState([]);
  const [value, setValue] = React.useState('');
  const inputRef = React.useRef(null);

  const run = (raw) => {
    const input = raw.trim();
    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(' ');

    switch (cmd) {
      case '':
        return '';
      case 'help':
        return [
          'available commands:',
          '  whoami          who is jane?',
          '  ls              list files',
          '  open <file>     open resume.pdf, github, or linkedin',
          '  theme <mode>    light, dark, or auto (follow the system)',
          '  tea             put the kettle on',
          '  clear           clear this session',
        ].join('\n');
      case 'whoami':
        return `${metadata.name} — ${metadata.description}. Scroll up; the whole transcript is about that.`;
      case 'pwd':
        return '/home/jane';
      case 'ls':
        return FILES;
      case 'cat':
        if (!arg) return 'usage: cat <file>';
        if (FILES.includes(arg.replace(/\/$/, '')))
          return `${arg}: already printed above — scroll up ↑`;
        return `cat: ${arg}: No such file or directory`;
      case 'open':
        if (/resume/.test(arg)) {
          window.open(`/${get(metadata, 'resume', '')}`, '_blank', 'noopener');
          return 'opening resume.pdf …';
        }
        if (/github/.test(arg)) {
          window.open(get(metadata, 'github', ''), '_blank', 'noopener');
          return 'opening github …';
        }
        if (/linkedin/.test(arg)) {
          window.open(get(metadata, 'linkedin', ''), '_blank', 'noopener');
          return 'opening linkedin …';
        }
        return 'usage: open resume.pdf | github | linkedin';
      case 'theme':
        if (arg === 'dark' || arg === 'light') {
          setTheme(arg);
          return `theme set to ${arg}`;
        }
        if (arg === 'auto' || arg === 'system') {
          setTheme('auto');
          return 'theme follows your system now';
        }
        return 'usage: theme dark | light | auto';
      case 'sudo':
        return 'jane is not in the sudoers file. This incident will be reported.';
      case 'tea':
        return 'steeping oolong … ready in 3 min. Best shared. 🍵';
      case 'hades':
        return 'There is no escape. (42 heat cleared, though.)';
      case 'exit':
      case 'logout':
        return 'This session stays open. Nice try.';
      case 'clear':
        return null;
      default:
        return `zsh: command not found: ${cmd} — try 'help'`;
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const input = value;
    setValue('');
    if (input.trim() === 'clear') {
      setLog([]);
      return;
    }
    const output = run(input);
    setLog((prev) => [...prev, { input, output }]);
  };

  return (
    <div className="iterm" onClick={() => inputRef.current?.focus()}>
      <p className="iterm-hint" id="iterm-hint">
        This prompt works. Type `help` to see what it knows.
      </p>
      <div className="iterm-log" aria-live="polite">
        {log.map((item, i) => (
          <div key={i}>
            <div>
              <span className="cmd-prompt" aria-hidden="true">
                {PROMPT}{' '}
              </span>
              <span className="iterm-log-cmd">{item.input}</span>
            </div>
            {item.output && <div className="iterm-log-out">{item.output}</div>}
          </div>
        ))}
      </div>
      <form className="iterm-row" onSubmit={onSubmit}>
        <Prompt />
        <input
          ref={inputRef}
          className="iterm-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={{ width: `${value.length}ch` }}
          aria-label="Terminal command input"
          aria-describedby="iterm-hint"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
        <span className="iterm-cursor" aria-hidden="true" />
      </form>
    </div>
  );
};

export default InteractivePrompt;
