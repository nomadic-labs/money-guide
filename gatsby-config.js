
let activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

const firebaseConfig = require(`./config/firebase-config.${process.env.GATSBY_FIREBASE_ENVIRONMENT}.json`)

module.exports = {
  siteMetadata: {
    title: `Money and the Law Guide`,
  },
  pathPrefix: `/`,
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Feminist Law Reform 101",
        short_name: "Feminist Law Reform 101",
        start_url: "/",
        background_color: "#000",
        theme_color: "#FCB239", // yellow
        display: "minimal-ui",
        icon: "static/icon.png" // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-firebase-nl",
      options: {
        credential: firebaseConfig.serviceAccountKey,
        databaseURL: firebaseConfig.databaseURL,
        types: [
          {
            type: "Pages",
            path: "pages",
            map: node => {
              node.content = JSON.stringify(node.content);

              return node
            },
          },
          {
            type: "Translations",
            path: "translations",
          },
          {
            type: "Tags",
            path: "tags",
          },
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        precision: 8,
      },
    }
  ]
};
