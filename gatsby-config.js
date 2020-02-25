const path = require(`path`)

const config = require(`./src/utils/siteConfig`)
const generateRSSFeed = require(`./src/utils/rss/generate-feed`)

let ghostConfig, bggConfig, googleSheetsConfig, bggEnv

try {
    ghostConfig = require(`./.ghost`)
    bggConfig = require(`./.bgg`)
    googleSheetsConfig = require(`./.google-sheets-config`)
} catch (e) {
    ghostConfig = {
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
    bggConfig = {
        production: {
            apiUrl: process.env.BGG_API_URL,
            username: process.env.BGG_API_USERNAME,
        },
    }
    googleSheetsConfig = {
        type: "service_account",
        project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
        private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(new RegExp('\\\\n', '\g'), '\n'),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
        client_x509_cert_url: process.env.GOOGLE_SHEETS_CLIENT_CERT_URL,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production;
    bggEnv = process.env.NODE_ENV === `development` ? bggConfig.development : bggConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        throw new Error(`GHOST_API_URL and GHOST_CONTENT_API_KEY are required to build. Check the README.`) // eslint-disable-line
    }
}

/**
* This is the place where you can tell Gatsby which plugins to use
* and set them up the way you want.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
*
*/
module.exports = {
    siteMetadata: {
        siteUrl: config.siteUrl,
    },
    plugins: [
        /**
         *  Content Plugins
         */
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `pages`),
                name: `pages`,
            },
        },
        // Setup for optimised images.
        // See https://www.gatsbyjs.org/packages/gatsby-image/
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        {
            resolve: 'gatsby-source-google-sheets',
            options: {
                spreadsheetId: googleSheetsConfig.spreadsheetId,
                worksheetTitle: 'Games',
                credentials: googleSheetsConfig
            }
        },
        {
            resolve: `gatsby-plugin-sharp`, 
            options: {
                useMozJpeg: false,
                stripMetadata: true,
                defaultQuality: 75,
                quality: 75
            },
        },
        {
            resolve: "gatsby-source-apiserver",
            options: {
              // Type prefix of entities from server
              typePrefix: "internal__",
        
              // The url, this should be the endpoint you are attempting to pull data from
              url: `${bggEnv.apiUrl}plays/${bggEnv.username}/`,
        
              method: "get",
        
              headers: {
                "Content-Type": "application/json"
              },

              name: `plays`,
            }
        },
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-source-ghost`,
            options:
                process.env.NODE_ENV === `development`
                    ? ghostConfig.development
                    : ghostConfig.production,
        },
        /**
         *  Utility Plugins
         */
        {
            resolve: `gatsby-plugin-ghost-manifest`,
            options: {
                short_name: config.shortTitle,
                start_url: `/`,
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                display: `minimal-ui`,
                icon: `static/${config.siteIcon}`,
                legacy: true,
                query: `
                {
                    allGhostSettings {
                        edges {
                            node {
                                title
                                description
                            }
                        }
                    }
                }
              `,
            },
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                {
                    allGhostSettings {
                        edges {
                            node {
                                title
                                description
                            }
                        }
                    }
                }
              `,
                feeds: [
                    generateRSSFeed(config),
                ],
            },
        },
        {
            resolve: `gatsby-plugin-advanced-sitemap`,
            options: {
                query: `
                {
                    allGhostPost {
                        edges {
                            node {
                                id
                                slug
                                updated_at
                                created_at
                                feature_image
                            }
                        }
                    }
                    allGhostPage {
                        edges {
                            node {
                                id
                                slug
                                updated_at
                                created_at
                                feature_image
                            }
                        }
                    }
                    allGhostTag {
                        edges {
                            node {
                                id
                                slug
                                feature_image
                            }
                        }
                    }
                    allGhostAuthor {
                        edges {
                            node {
                                id
                                slug
                                profile_image
                            }
                        }
                    }
                }`,
                mapping: {
                    allGhostPost: {
                        sitemap: `posts`,
                    },
                    allGhostTag: {
                        sitemap: `tags`,
                    },
                    allGhostAuthor: {
                        sitemap: `authors`,
                    },
                    allGhostPage: {
                        sitemap: `pages`,
                    },
                },
                exclude: [
                    `/dev-404-page`,
                    `/404`,
                    `/404.html`,
                    `/offline-plugin-app-shell-fallback`,
                    /(\/)?hash-\S*/, 
                ],
                createLinkInHead: true,
                addUncaughtPages: true,
            },
        },
        `gatsby-plugin-catch-links`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-force-trailing-slashes`,
        `gatsby-plugin-offline`,
    ],
}
