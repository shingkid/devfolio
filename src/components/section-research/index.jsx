import React from 'react';

import Section from '../section';
import SummaryItem from '../summary-item';

const SectionResearch = ({ research }) => {
  if (!research.length) return null;

  return (
    <Section title="Research">
      {research.map((item) => (
        <SummaryItem
          key={item.name}
          name={item.name}
          description={item.description}
          link={item.link}
        />
      ))}
    </Section>
  );
};

export default SectionResearch;
