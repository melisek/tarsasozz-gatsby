const path = require(`path`)
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
})

const config = require(`./src/utils/siteConfig`)
const generateRSSFeed = require(`./src/utils/rss/generate-feed`)
const queries = require(`./src/utils/algolia`)

let ghostConfig

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production;

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
                spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
                worksheetTitle: process.env.GOOGLE_SHEETS_WORKSHEET_NAME,
                credentials: {
                    type: "service_account",
                    project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
                    private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
                    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(new RegExp('\\\\n', '\g'), '\n'),
                    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                    client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
                    client_x509_cert_url: process.env.GOOGLE_SHEETS_CLIENT_CERT_URL,
                    auth_uri: "https://accounts.google.com/o/oauth2/auth",
                    token_uri: "https://oauth2.googleapis.com/token",
                    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
                }
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
            resolve: `gatsby-source-apiserver`,
            options: {
                    typePrefix: "internal__",
                    method: "get",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    entitiesArray: [
                        {  
                            url: `${process.env.BGG_API_URL}mostplayed/${process.env.BGG_API_USERNAME}/`,
                            name: `mostPlayedGames`
                        },
                        {
                            url: `https://tarsasozz-wizard.azurewebsites.net/wizard/list`,
                            name: `gameData`
                        },
                        {  
                            url: `${process.env.BGG_API_URL}collection/${process.env.BGG_API_USERNAME}/`,
                            name: `gameCollection`
                        }
                    ]
            }
        },
        
        // {
        //     resolve: "gatsby-source-apiserver",
        //     options: {
        //       // Type prefix of entities from server
        //       typePrefix: "internal__",
        
        //       // The url, this should be the endpoint you are attempting to pull data from
        //       url: `${bggEnv.apiUrl}mostplayed/${bggEnv.username}/`,
        
        //       method: "get",
        
        //       headers: {
        //         "Content-Type": "application/json"
        //       },

        //       name: `mostPlayedGames`,
        //     }
        // },
        {
            resolve: `gatsby-plugin-gdpr-cookies`,
            options: {
                googleAnalytics: {
                    trackingId: 'UA-153160787-1', // leave empty if you want to disable the tracker
                    cookieName: 'gatsby-gdpr-google-analytics', // default
                    anonymize: true // default
                },
                googleTagManager: {
                    trackingId: '', // leave empty if you want to disable the tracker
                    cookieName: 'gatsby-gdpr-google-tagmanager', // default
                    dataLayerName: 'dataLayer', // default
                },
                facebookPixel: {
                    pixelId: '', // leave empty if you want to disable the tracker
                    cookieName: 'gatsby-gdpr-facebook-pixel', // default
                },
                // defines the environments where the tracking should be available  - default is ["production"]
                environments: ['production', 'development']
            },
        },
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-source-ghost`,
            options:
                process.env.NODE_ENV === `development`
                    ? ghostConfig.development
                    : ghostConfig.production,
        },
        {
            resolve: `gatsby-plugin-algolia`,
            options: {
              appId: process.env.GATSBY_ALGOLIA_APP_ID,
              apiKey: process.env.ALGOLIA_API_KEY,
              indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME, // for all queries
              queries,
              chunkSize: 1000, // default: 1000
            },
        },
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-preload-fonts`,
        `gatsby-plugin-netlify`,
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
