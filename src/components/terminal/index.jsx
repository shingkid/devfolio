import React from 'react';

export const PROMPT = 'jane@sgp:~$';

export const Prompt = () => (
  <span className="cmd-prompt" aria-hidden="true">
    {PROMPT}{' '}
  </span>
);

// Replays the command being typed on mount. The full text is server-rendered,
// so nothing is gated on JS or motion; reduced-motion skips the replay.
export const TypedCommand = ({ text }) => {
  const [shown, setShown] = React.useState(text);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    setShown('');
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 65);
    return () => clearInterval(id);
  }, [text]);

  return shown;
};

// One transcript entry: a prompt + command line, then its output. The command
// line doubles as the section heading; `label` gives screen readers a plain
// name for the command's pun.
const CommandBlock = ({
  command,
  label,
  as: Heading = 'h2',
  first = false,
  children,
}) => {
  return (
    <section className={first ? 'cmd cmd--first' : 'cmd'}>
      <Heading className="cmd-line" aria-label={label}>
        <Prompt />
        {command}
      </Heading>
      <div className="cmd-output">{children}</div>
    </section>
  );
};

export default CommandBlock;
