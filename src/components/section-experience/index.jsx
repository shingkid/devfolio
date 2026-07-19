import React from 'react';

import CommandBlock from '../terminal';

const SectionExperience = ({ experience }) => {
  if (!experience.length) return null;

  return (
    <CommandBlock command="history --reverse" label="Work experience">
      <ol>
        {experience.map((item, i) => (
          <li className="history-item" key={`${item.name}-${item.description}`}>
            <span className="history-num" aria-hidden="true">
              {experience.length - i}
            </span>
            <div>
              <h3 className="entry-name">
                {item.link ? <a href={item.link}>{item.name}</a> : item.name}
              </h3>
              <p className="entry-desc">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </CommandBlock>
  );
};

export default SectionExperience;
