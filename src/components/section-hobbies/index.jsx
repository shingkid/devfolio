import React from 'react';

import Section from '../section';
import SummaryItem from '../summary-item';

const SectionHobbies = ({ hobbies }) => {
  return (
    <Section title="Hobbies">
      {hobbies.map((hobby) => (
        <SummaryItem
          key={hobby.name}
          name={hobby.name}
          description={hobby.description}
        />
      ))}
    </Section>
  );
};

export default SectionHobbies;
