import React from 'react';

import CommandBlock from '../terminal';

const SectionHobbies = ({ hobbies }) => {
  if (!hobbies.length) return null;

  return (
    <CommandBlock command="cat hobbies.txt" label="Hobbies">
      {hobbies.map((hobby) => (
        <div className="entry" key={hobby.name}>
          <h3 className="entry-name">{hobby.name}</h3>
          <p className="entry-desc">{hobby.description}</p>
        </div>
      ))}
    </CommandBlock>
  );
};

export default SectionHobbies;
