module.exports = {
  siteMetadata: {
    // Site URL for when it goes live
    siteUrl: `https://www.janeseah.com/`,
    // Your Name
    name: 'Jane Seah',
    // Main Site Title
    title: `Jane Seah | Software Engineer`,
    // Description that goes under your name in main bio
    description: `Aspiring machine learning engineer`,
    // Optional: Twitter account handle
    author: `@shingkid`,
    // Optional: Github account URL
    github: `https://github.com/shingkid`,
    // Optional: LinkedIn account URL
    linkedin: `https://www.linkedin.com/in/janeseah/`,
    // Content of the About Me section
    about: `A highly driven problem-solver passionate about building impactful, scalable, quality software, with a special interest in using data for good.`,
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
          'This project aims to recommend effective deployment locations for police emergency response cars. When an emergency ‘999’ call is made, a car will be dispatched from its base location to respond. The time between the placing of the call and the arrival of a car at an incident can be critical in preventing crimes and protecting citizens. Given that response resources are finite and incident occurrences are not uniformly distributed, the choice of base location can have a significant impact on the ability of cars to respond quickly to incidents. We were awarded Best Performing Team for achieving the lowest response failure rates for both normal and high demand evaluation cases.',
        link: 'https://github.com/shingkid/base-location-optimization',
      },
      {
        name: 'Plugin to a Healthier Life: A Web Browser Plugin for Mental Health Monitoring (2019)',
        description:
          'This project seeks to explore how relevant mental health help can be served as soft nudges to SMU students who may need it, in a private way, through the use of a web plugin. By tracking the fluctuations of the users\' daily moods, searches, and work schedules, the web plugin aims to push relevant mental health content to the users, to prevent them from spiralling deeper into anxiety or depression. The poster paper for this project was accepted to the 2019 IEEE International Conference on Big Data.',
        link: 'https://ieeexplore.ieee.org/document/9005522',
      },
      {
        name: 'Crowd Evacuation Simulation (2019)',
        description:
          'This project attempts to discover factors which significantly impede crowd evacuation and the extent of human stampede impact on survival. Our agent-based simulation is modelled on a hypothetical fire emergency during Singapore\'s National Day Parade at The Float @ Marina Bay using NetLogo.',
        link: 'https://github.com/shingkid/crowd-evacuation-simulation',
      },
      {
        name: 'Data Mining Approach to the Detection of Suicide in Social Media: A Case Study of Singapore (2018)',
        description:
          'In this research, we focus on the social phenomenon of suicide. Specifically, we perform social sensing on digital traces obtained from Reddit. We analyze the posts and comments in that are related to suicide. We perform natural language processing to better understand different aspects of human life that relate to suicide. The poster paper for this project was accepted to the 2018 IEEE International Conference on Big Data.',
        link: 'https://ieeexplore.ieee.org/document/8622528',
      },
      {
        name: 'Terra Matter Waste Management (2018)',
        description:
          'A mobile app for users to earn cash on the side while helping to save the earth by selling their recyclables. Available on both iOS and Android devices.',
        link: 'https://play.google.com/store/apps/details?id=com.terramatter.terraapp',
      },
    ],
    // Optional: List your experience, they must have `name` and `description`. `link` is optional.
    experience: [
      {
        name: 'Goldman Sachs',
        description: 'New Analyst (GIR Engineering), August 2020 - Present',
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
      },
      {
        name: 'Singapore Management University',
        description: 'Teaching Assistant & Student Assistant, May 2017 - April 2019',
      },
    ],
    // Optional: List your skills, they must have `name` and `description`.
    skills: [
      {
        name: 'Languages & Frameworks',
        description:
          'Java, Python, Clojure, JavaScript (ES6+), Ruby',
      },
      {
        name: 'Databases',
        description: 'MongoDB, MySQL, Firebase',
      },
      {
        name: 'Other',
        description:
          'Docker, Amazon Web Services (AWS), CI / CD, Microservices, API design, Agile / Scrum',
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
        trackingId: `ADD YOUR TRACKING ID HERE`, // Optional Google Analytics
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
