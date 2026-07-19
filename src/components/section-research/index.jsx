import React from 'react';

import CommandBlock from '../terminal';

const SectionResearch = ({ research }) => {
  if (!research.length) return null;

  return (
    <CommandBlock command="cat research.md" label="Research">
      {research.map((item) => (
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

export default SectionResearch;
