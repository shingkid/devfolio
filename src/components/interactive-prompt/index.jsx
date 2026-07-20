import get from 'lodash/get';
import React from 'react';

import { Whoami, LinksSection } from '../header';
import SectionAbout from '../section-about';
import SectionBlog from '../section-blog';
import SectionEducation from '../section-education';
import SectionExperience from '../section-experience';
import SectionHobbies from '../section-hobbies';
import SectionProjects from '../section-projects';
import SectionResearch from '../section-research';
import SectionSkills from '../section-skills';
import { PROMPT, Prompt } from '../terminal';

const FILES =
  'about.txt  education.log  hobbies.txt  links/  projects/  research.md  resume.pdf';

// Suggestions once the whole tour has been run — kept cycling so the
// prompt never goes quiet.
const ENCORE_COMMANDS = ['help', 'tea', 'theme dark', 'hades', 'clear'];

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

// The whole portfolio as one live session: only `whoami` has already run;
// everything else is a command the visitor runs themselves. The prompt
// cycles through suggested commands — Enter runs the one shown, clicking
// the terminal grabs it for editing, and `help` explains all of it. The
// full transcript is still server-rendered for crawlers and no-JS
// visitors, then swapped out at hydration.
const InteractiveSession = ({ metadata = {}, posts = [] }) => {
  const [hydrated, setHydrated] = React.useState(false);
  const [log, setLog] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [ran, setRan] = React.useState([]);
  const [sIdx, setSIdx] = React.useState(0);
  const [ghost, setGhost] = React.useState('');
  const inputRef = React.useRef(null);
  const endRef = React.useRef(null);

  React.useEffect(() => setHydrated(true), []);

  const noBlog = !posts || !posts.length;

  // the tour: every section of the old transcript, now a suggestion. Each
  // section component still echoes its own command line, so a run entry
  // looks exactly like the transcript block it replaces.
  const sections = [
    metadata.about && {
      cmd: 'cat about.txt',
      desc: 'who I am',
      render: () => <SectionAbout about={metadata.about} />,
    },
    get(metadata, 'experience.length') && {
      cmd: 'history --reverse',
      desc: "where I've worked",
      render: () => <SectionExperience experience={metadata.experience} />,
    },
    get(metadata, 'projects.length') && {
      cmd: 'tree projects/',
      desc: "things I've built",
      render: () => <SectionProjects projects={metadata.projects} />,
    },
    get(metadata, 'research.length') && {
      cmd: 'cat research.md',
      desc: 'published work',
      render: () => <SectionResearch research={metadata.research} />,
    },
    !noBlog && {
      cmd: 'ls -t blog/',
      desc: 'latest posts',
      render: () => <SectionBlog posts={posts} />,
    },
    get(metadata, 'education.length') && {
      cmd: 'cat education.log',
      desc: 'where I studied',
      render: () => <SectionEducation education={metadata.education} />,
    },
    get(metadata, 'skills.length') && {
      cmd: 'env',
      desc: 'languages, tools, infra',
      render: () => <SectionSkills skills={metadata.skills} />,
    },
    get(metadata, 'hobbies.length') && {
      cmd: 'cat hobbies.txt',
      desc: 'off the clock',
      render: () => <SectionHobbies hobbies={metadata.hobbies} />,
    },
    {
      cmd: 'ls -l links/',
      desc: 'github, linkedin, resume',
      render: () => <LinksSection metadata={metadata} noBlog={noBlog} />,
    },
  ].filter(Boolean);

  const remaining = sections.filter((s) => !ran.includes(s.cmd));
  const pool = remaining.length ? remaining.map((s) => s.cmd) : ENCORE_COMMANDS;
  const suggestion = pool[sIdx % pool.length];

  // type the suggestion out character by character, then hold
  React.useEffect(() => {
    if (!hydrated) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGhost(suggestion);
      return undefined;
    }
    let i = 0;
    setGhost('');
    const id = setInterval(() => {
      i += 1;
      setGhost(suggestion.slice(0, i));
      if (i >= suggestion.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [suggestion, hydrated]);

  // cycle to the next suggestion while the input sits empty
  React.useEffect(() => {
    if (!hydrated || value) return undefined;
    const id = setInterval(() => setSIdx((i) => i + 1), 4200);
    return () => clearInterval(id);
  }, [hydrated, value]);

  React.useEffect(() => {
    if (!log.length) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches;
    endRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
    });
  }, [log]);

  const findSection = (input) => {
    const lower = input.toLowerCase();
    const bare = lower.replace(/^cat\s+/, '').replace(/\.\w+$/, '');
    return sections.find(
      (s) =>
        s.cmd === lower ||
        s.cmd.replace(/^cat\s+/, '').replace(/\.\w+$/, '') === bare ||
        (lower === 'history' && s.cmd === 'history --reverse') ||
        (lower === 'experience' && s.cmd === 'history --reverse') ||
        (lower === 'projects' && s.cmd === 'tree projects/') ||
        (lower === 'skills' && s.cmd === 'env') ||
        (lower === 'links' && s.cmd === 'ls -l links/') ||
        (lower === 'blog' && s.cmd === 'ls -t blog/')
    );
  };

  const helpText = () => {
    const tour = sections.map(
      (s) => `  ${s.cmd.padEnd(20)}${ran.includes(s.cmd) ? '✓ ' : ''}${s.desc}`
    );
    return [
      'this portfolio is a live session — one command at a time.',
      '',
      '  enter ⏎     run the suggested command shown at the prompt',
      '  click/tab   grab the suggestion so you can edit it first',
      '  type        or ignore the suggestions and type your own',
      '',
      `the tour (${ran.length}/${sections.length} seen):`,
      ...tour,
      '',
      'extras:',
      '  open <file>     open resume.pdf, github, or linkedin',
      '  theme <mode>    light, dark, or auto (follow the system)',
      '  ls · pwd · whoami · clear · tea',
      '',
      'the cat (bottom right): click or space to pet · drag it anywhere ·',
      'double-click to send it home',
    ].join('\n');
  };

  const runBuiltin = (input) => {
    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(' ');

    switch (cmd) {
      case 'help':
      case 'info':
        return helpText();
      case 'whoami':
        return `${metadata.name} — ${metadata.description}. The rest is one command away; try 'help'.`;
      case 'pwd':
        return '/home/jane';
      case 'ls':
        return `${FILES}\n(try: cat about.txt)`;
      case 'cat':
        if (!arg) return 'usage: cat <file>';
        if (/^(links|projects|blog)\/?$/.test(arg))
          return `cat: ${arg}: Is a directory — try '${
            arg.replace(/\/$/, '') === 'projects'
              ? 'tree projects/'
              : `ls -l ${arg}`
          }'`;
        if (/resume/.test(arg))
          return `cat: ${arg}: binary file — try 'open resume.pdf'`;
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
      default:
        return `zsh: command not found: ${cmd} — try 'help'`;
    }
  };

  const runCommand = (raw) => {
    const input = raw.trim();
    setValue('');
    if (!input) return;
    if (input === 'clear') {
      setLog([]);
      return;
    }
    const section = findSection(input);
    if (section) {
      setLog((prev) => [...prev, { type: 'section', cmd: section.cmd }]);
      setRan((prev) =>
        prev.includes(section.cmd) ? prev : [...prev, section.cmd]
      );
    } else {
      setLog((prev) => [
        ...prev,
        { type: 'text', input, output: runBuiltin(input) },
      ]);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    runCommand(value.trim() || suggestion);
  };

  const onKeyDown = (event) => {
    if (
      (event.key === 'Tab' || event.key === 'ArrowRight') &&
      !value &&
      ghost
    ) {
      event.preventDefault();
      setValue(suggestion);
    }
  };

  // clicking anywhere in the session (not on a link, and not while
  // selecting text) grabs the currently suggested command
  const onAreaClick = (event) => {
    if (event.target.closest('a, button')) return;
    if (window.getSelection && String(window.getSelection())) return;
    if (hydrated && !value) setValue(suggestion);
    inputRef.current?.focus({ preventScroll: true });
  };

  const sectionByCmd = (cmd) => sections.find((s) => s.cmd === cmd);

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <div className="session" onClick={onAreaClick}>
      <Whoami metadata={metadata} />

      {/* Server-rendered full transcript for crawlers and no-JS visitors.
          html.js hides it before first paint; hydration removes it. */}
      {!hydrated && (
        <div className="transcript-static">
          <LinksSection metadata={metadata} noBlog={noBlog} />
          {sections
            .filter((s) => s.cmd !== 'ls -l links/')
            .map((s) => (
              <React.Fragment key={s.cmd}>{s.render()}</React.Fragment>
            ))}
        </div>
      )}

      <div className="iterm-log" aria-live="polite">
        {log.map((item, i) =>
          item.type === 'section' ? (
            <React.Fragment key={i}>
              {sectionByCmd(item.cmd)?.render()}
            </React.Fragment>
          ) : (
            <div className="iterm-entry" key={i}>
              <div>
                <span className="cmd-prompt" aria-hidden="true">
                  {PROMPT}{' '}
                </span>
                <span className="iterm-log-cmd">{item.input}</span>
              </div>
              {item.output && (
                <div className="iterm-log-out">{item.output}</div>
              )}
            </div>
          )
        )}
        <div ref={endRef} />
      </div>

      <div className="iterm">
        <p className="iterm-hint" id="iterm-hint">
          {hydrated
            ? 'A command is suggested below — press ⏎ to run it, click or tab to edit it, or type your own. `help` explains everything.'
            : 'This prompt works with JavaScript enabled — the full transcript is printed above.'}
        </p>
        <form className="iterm-row" onSubmit={onSubmit}>
          <Prompt />
          <input
            ref={inputRef}
            className="iterm-input"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            style={{ width: `${value.length}ch` }}
            aria-label="Terminal command input. Press Enter to run the suggested command, or type your own."
            aria-describedby="iterm-hint"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {hydrated && !value && (
            <span className="iterm-ghost" aria-hidden="true">
              {ghost}
            </span>
          )}
          <span className="iterm-cursor" aria-hidden="true" />
        </form>
      </div>
    </div>
  );
};

export default InteractiveSession;
