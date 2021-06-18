
let activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

const firestoreConfig = require(`./config/firebase-config.${process.env.GATSBY_FIREBASE_ENVIRONMENT}.json`)

module.exports = {
  siteMetadata: {
    title: `Money and the Law Guide`,
  },
  pathPrefix: `/`,
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Money and the Law Guide",
        short_name: "Money and the Law Guide",
        start_url: "/",
        background_color: "#000",
        theme_color: "#FCB239", // yellow
        display: "minimal-ui",
        icon: "static/icon.png" // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-firestore",
      options: {
        credential: firestoreConfig.serviceAccountKey,
        types: [
          {
            type: "Pages",
            collection: "pages",
            map: node => {
              node.content = JSON.stringify(node.content);

              return node
            },
          },
          {
            type: "Translations",
            collection: "translations",
          },
          {
            type: "Tags",
            collection: "tags",
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        precision: 8,
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "money-guide",
        protocol: "https",
        hostname: process.env.GATSBY_HOSTNAME,
      },
    },
  ]
};
