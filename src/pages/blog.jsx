import { graphql } from 'gatsby';
import React from 'react';

import BlogPosts from '../components/blog-posts';
import Header from '../components/header';
import Layout from '../components/layout';
import Seo from '../components/seo';
import NotFound from '../pages/404';

const Blog = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;

  if (!posts || !posts.length) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Seo title="Blog" />
      <Header metadata={data.site.siteMetadata} noBlog={false} />
      <BlogPosts posts={posts} />
    </Layout>
  );
};

export default Blog;

export const pageQuery = graphql`
  query {
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
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
