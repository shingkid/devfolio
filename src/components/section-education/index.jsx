import React from 'react';

import CommandBlock from '../terminal';

const SectionEducation = ({ education }) => {
  if (!education.length) return null;

  return (
    <CommandBlock command="cat education.log" label="Education">
      {education.map((item) => (
        <div className="entry" key={item.name}>
          <h3 className="entry-name">
            {item.link ? <a href={item.link}>{item.name}</a> : item.name}
          </h3>
          <p className="entry-desc">{item.description}</p>
        </div>
      ))}
    </CommandBlock>
  );
};

export default SectionEducation;
