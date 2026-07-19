import { Link } from 'gatsby';
import React from 'react';

import CommandBlock from '../terminal';

const SectionBlog = ({ posts }) => {
  return (
    <CommandBlock command="ls -t blog/" label="Latest posts">
      {posts.map((post) => (
        <div className="entry" key={post.node.fields.slug}>
          <h3 className="entry-name">
            <Link to={post.node.fields.slug}>
              {post.node.frontmatter.title}
            </Link>
          </h3>
          <p className="entry-desc">{post.node.frontmatter.description}</p>
        </div>
      ))}
      {posts.length >= 5 && (
        <p className="entry">
          <Link to="/blog">view all posts</Link>
        </p>
      )}
    </CommandBlock>
  );
};

export default SectionBlog;
