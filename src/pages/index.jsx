import { graphql } from 'gatsby';
import React from 'react';

import InteractiveSession from '../components/interactive-prompt';
import Layout from '../components/layout';
import Seo from '../components/seo';

const Index = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout>
      <Seo />
      <InteractiveSession metadata={data.site.siteMetadata} posts={posts} />
    </Layout>
  );
};

export default Index;

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
        projects {
          name
          description
          link
        }
        research {
          name
          description
          link
        }
        experience {
          name
          description
          link
        }
        education {
          name
          description
          link
        }
        skills {
          name
          description
        }
        hobbies {
          name
          description
        }
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 5) {
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
