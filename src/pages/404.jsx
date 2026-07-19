import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import CommandBlock from '../components/terminal';
import Seo from '../components/seo';

const NotFoundPage = ({ location }) => (
  <Layout>
    <Seo title="Not found" />
    <CommandBlock
      command={`cat ${location?.pathname?.slice(1) || 'this-page'}`}
      label="Page not found"
      first
    >
      <p>cat: No such file or directory (404)</p>
      <p className="entry">
        <Link to="/">cd ~ — return home</Link>
      </p>
    </CommandBlock>
  </Layout>
);

export default NotFoundPage;
