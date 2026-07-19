import React from 'react';

import CommandBlock from '../terminal';

const toEnvKey = (name) =>
  name
    .toUpperCase()
    .replace(/\s*&\s*/g, '_')
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const SectionSkills = ({ skills }) => {
  if (!skills.length) return null;

  return (
    <CommandBlock command="env" label="Skills">
      {skills.map((skill) => (
        <p className="env-item" key={skill.name}>
          <span className="env-key">{toEnvKey(skill.name)}</span>
          <span className="env-eq">=&quot;</span>
          {skill.description}
          <span className="env-eq">&quot;</span>
        </p>
      ))}
    </CommandBlock>
  );
};

export default SectionSkills;
