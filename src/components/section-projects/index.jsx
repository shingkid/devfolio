import React from 'react';

import CommandBlock from '../terminal';

const SectionProjects = ({ projects }) => {
  if (!projects.length) return null;

  return (
    <CommandBlock command="tree projects/" label="Projects">
      <ul>
        {projects.map((project, i) => (
          <li className="tree-item" key={project.name}>
            <span className="tree-glyph" aria-hidden="true">
              {i === projects.length - 1 ? '└──' : '├──'}
            </span>
            <div>
              <h3 className="tree-name">
                {project.link ? (
                  <a href={project.link}>{project.name}</a>
                ) : (
                  project.name
                )}
              </h3>
              <p className="tree-desc">{project.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </CommandBlock>
  );
};

export default SectionProjects;
