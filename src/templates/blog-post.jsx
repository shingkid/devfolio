import { graphql, Link } from 'gatsby';
import moment from 'moment';
import React from 'react';

import Layout from '../components/layout';
import CommandBlock from '../components/terminal';
import SEO from '../components/seo';

const BlogPost = ({ data }) => {
  const post = data.markdownRemark;
  const slug = post.fields?.slug || '';
  const file = slug.replace(/^\/blog\//, '').replace(/\/$/, '') || 'post';

  return (
    <Layout>
      <SEO title={post.frontmatter.title} />
      <CommandBlock command={`cat blog/${file}.md`} label="Blog post" first>
        <h1 className="blog-title">{post.frontmatter.title}</h1>
        <p className="blog-meta">
          Posted on {moment(post.frontmatter.date).format('MMMM D, YYYY')}
        </p>
        <div
          className="blog-content"
          style={{ marginTop: '1.5rem' }}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <p className="entry">
          <Link to="/">cd ~ — back home</Link>
        </p>
      </CommandBlock>
    </Layout>
  );
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        name
        title
        description
        about
        author
        github
        linkedin
        resume
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
