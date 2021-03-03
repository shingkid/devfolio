module.exports = {
  siteMetadata: {
    // Site URL for when it goes live
    siteUrl: `https://www.janeseah.com/`,
    // Your Name
    name: 'Jane Seah',
    // Main Site Title
    title: `Jane Seah | Software Engineer`,
    // Description that goes under your name in main bio
    description: `Software Engineer based in Singapore.`,
    // Optional: Twitter account handle
    author: `@shingkid`,
    // Optional: Github account URL
    github: `https://github.com/shingkid`,
    // Optional: LinkedIn account URL
    linkedin: `https://www.linkedin.com/in/janeseah/`,
    // Content of the About Me section
    about: `A highly driven problem-solver passionate about building impactful, scalable, quality software, with a special interest in using data for good. I recently graduated with an Information Systems & Analytics degree as a SG:Digital Scholar and now develop with cloud and big data technologies at Goldman Sachs Engineering.`,
    // Optional: List your projects, they must have `name` and `description`. `link` is optional.
    projects: [
      {
        name: 'Dr Watson (2020)',
        description:
          'A prototype smart evacuation and rescue system that leverages data from WiFi, CCTVs and sound sensors to locate crowds, identify trapped or vulnerable occupants, compute optimal escape routes and provide real-time visualization of vital information for quick and effective decision-making by rescuers. 1st Prize @ the SCDF X IBM - Lifesavers\' Innovation Challenge: Call For Code 2020.',
        link: 'http://dr-watson-to-the-rescue.s3-website-ap-southeast-1.amazonaws.com/',
      },
      {
        name: 'Your Own Learning Adventure (2020)',
        description:
          'High-fidelity prototype of YOLA, a platform designed to enable effective learning for students and fuss-free tracking of their child’s learning for parents.',
        link: 'https://www.figma.com/proto/IaOkP8ZjXP3DWud8T1e5qW/Combined?node-id=162%3A2205&scaling=scale-down',
      },
      {
        name: 'Law Enforcement Vehicle Location Optimization (2019)',
        description:
          'An algorithm for recommending effective deployment locations for police emergency response cars which achieved the lowest response failure rates for both normal and high demand evaluation cases. Awarded Best Performing Team.',
        link: 'https://github.com/shingkid/base-location-optimization',
      },
      {
        name: 'Crowd Evacuation Simulation (2019)',
        description:
          'An agent-based simulation to discover factors which significantly impede crowd evacuation and the extent of human stampede impact on survival using Netlogo.',
        link: 'https://github.com/shingkid/crowd-evacuation-simulation',
      },
      {
        name: 'Terra Matter Waste Management (2018)',
        description:
          'A mobile app for users to earn cash on the side while helping to save the earth by selling their recyclables. Available on both iOS and Android devices.',
        link: 'https://play.google.com/store/apps/details?id=com.terramatter.terraapp',
      },
    ],
    // Custom
    research: [
      {
        name: 'Plugin to a Healthier Life: A Web Browser Plugin for Mental Health Monitoring (2019)',
        description:
          'A web plugin that aims to push relevant mental health content, by tracking the fluctuations of the users\' daily moods, searches, and work schedules. The poster paper for this project was accepted to the 2019 IEEE International Conference on Big Data.',
        link: 'https://ieeexplore.ieee.org/document/9005522',
      },
      {
        name: 'Data Mining Approach to the Detection of Suicide in Social Media: A Case Study of Singapore (2018)',
        description:
          'An NLP project focused on the social phenomenon of suicide. Relevant posts and comments on Reddit were scraped and analyzed to better understand different aspects of human life that relate to suicide. The poster paper for this project was accepted to the 2018 IEEE International Conference on Big Data.',
        link: 'https://ieeexplore.ieee.org/document/8622528',
      },
    ],
    // Optional: List your experience, they must have `name` and `description`. `link` is optional.
    experience: [
      {
        name: 'Goldman Sachs',
        description: 'New Analyst (GIR Engineering), August 2020 - Present',
        link: '',
      },
      {
        name: 'INTELLLEX & SGInnovate',
        description: 'Junior Data Scientist & Summation Apprentice, May 2019 - August 2019',
        link: 'https://medium.com/intelllex/inte-rn-lllex-spotlight-interview-jane-seah-e8e738b3a919',
      },
      {
        name: 'Skilio',
        description: 'Pioneer, February 2019 - August 2019',
        link: 'https://skilio.co/',
      },
      {
        name: 'DSO National Laboratories',
        description: 'Cyber Analytics Research Intern, May 2018 - August 2018',
        link: '',
      },
      {
        name: 'Singapore Management University',
        description: 'Teaching Assistant & Student Assistant, May 2017 - April 2019',
        link: '',
      },
    ],
    // Custom
    education: [
      {
        name: 'Singapore Management University',
        description: 'BSc in Information Systems & Analytics, summa cum laude, August 2016 - June 2020',
        link: '',
      },
      {
        name: 'The University of Edinburgh',
        description: 'International Student Exchange Programme, September 2019 - December 2019',
        link: '',
      },
      {
        name: 'University of Oxford',
        description: 'Exeter College Summer Programme, July 2017 - August 2017',
        link: 'https://www.exeter.ox.ac.uk/ecsp/',
      },
    ],
    // Optional: List your skills, they must have `name` and `description`.
    skills: [
      {
        name: 'Languages & Frameworks',
        description:
          'Java, Spring, Python, Django, Flask, Clojure, Ruby',
      },
      {
        name: 'Databases',
        description: 'MongoDB, MySQL',
      },
      {
        name: 'Other',
        description:
          'Git, Docker, Amazon Web Services (AWS), Microservices, Apache Kafka, GraphQL',
      },
    ],
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              wrapperStyle: `margin: 0 0 30px;`,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-158859179-1`, // Optional Google Analytics
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `devfolio`,
        short_name: `devfolio`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`, // This color appears on mobile
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
  ],
};
