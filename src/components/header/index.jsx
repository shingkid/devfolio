import { Link } from 'gatsby';
import get from 'lodash/get';
import React from 'react';

import portrait from '../../images/heikala.jpg';
import CommandBlock, { TypedCommand } from '../terminal';

// The whoami hero — always the first, already-run command in the session.
export const Whoami = ({ metadata = {} }) => (
  <CommandBlock command={<TypedCommand text="whoami" />} as="p" first>
    <div className="hero">
      <div className="hero-text">
        <h1 className="hero-name">
          <Link to="/">{metadata.name}</Link>
          <span className="hero-cursor" aria-hidden="true" />
        </h1>
        <p className="hero-role">{metadata.description}</p>
      </div>
      <figure className="hero-portrait">
        <img
          src={portrait}
          alt="Watercolor portrait of Jane sketching on a floating pane of light against a deep blue night sky"
          width="660"
          height="660"
        />
        <figcaption>portrait.jpg — art by Heikala</figcaption>
      </figure>
    </div>
  </CommandBlock>
);

export const LinksSection = ({ metadata = {}, noBlog = true }) => {
  const twitter = get(metadata, 'author', false);
  const github = get(metadata, 'github', false);
  const linkedin = get(metadata, 'linkedin', false);
  const resume = get(metadata, 'resume', false);

  const links = [
    github && {
      name: 'github',
      href: github,
      target: github.replace('https://', ''),
    },
    linkedin && {
      name: 'linkedin',
      href: linkedin,
      target: linkedin.replace('https://', '').replace(/\/$/, ''),
    },
    twitter && {
      name: 'twitter',
      href: `https://twitter.com/${twitter.replace('@', '')}`,
      target: `twitter.com/${twitter.replace('@', '')}`,
    },
    resume && {
      name: 'resume.pdf',
      href: `/${resume}`,
      target: '~/documents/resume.pdf',
    },
  ].filter(Boolean);

  return (
    <CommandBlock command="ls -l links/" label="Links">
      <ul className="links-list">
        {links.map((link) => (
          <li key={link.name}>
            <a href={link.href}>{link.name}</a>
            <span className="links-arrow" aria-hidden="true">
              -&gt;
            </span>
            <span className="links-target">{link.target}</span>
          </li>
        ))}
        {!noBlog && (
          <li>
            <Link to="/blog">blog/</Link>
            <span className="links-arrow" aria-hidden="true">
              -&gt;
            </span>
            <span className="links-target">/blog</span>
          </li>
        )}
      </ul>
    </CommandBlock>
  );
};

const Header = ({ metadata = {}, noBlog = true }) => (
  <>
    <Whoami metadata={metadata} />
    <LinksSection metadata={metadata} noBlog={noBlog} />
  </>
);

export default Header;
