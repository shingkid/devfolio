import React from 'react';

import CommandBlock from '../terminal';

const SectionAbout = ({ about }) => {
  return (
    <CommandBlock command="cat about.txt" label="About me">
      <p>{about}</p>
    </CommandBlock>
  );
};

export default SectionAbout;
