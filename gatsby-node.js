const path = require(`path`)
const { postsPerPage } = require(`./src/utils/siteConfig`)
const { paginate } = require(`gatsby-awesome-pagination`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

/**
 * Here is the place where Gatsby creates the URLs for all the
 * posts, tags, pages and authors that we fetched from the Ghost site.
 */
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions

    const result = await graphql(`
        {
            allGhostPost(sort: { order: ASC, fields: published_at }) {
                edges {
                    node {
                        slug
                        tags {
                            slug
                            visibility
                        }
                    }
                }
            }
            allGhostTag(sort: { order: ASC, fields: name } ) {
                edges {
                    node {
                        slug
                        url
                        postCount
                        visibility
                    }
                }
            }
            allGhostAuthor(sort: { order: ASC, fields: name }) {
                edges {
                    node {
                        slug
                        url
                        postCount
                    }
                }
            }
            allGhostPage(sort: { order: ASC, fields: published_at }) {
                edges {
                    node {
                        slug
                        url
                        featured
                        tags {
                            slug
                            visibility
                        }
                    }
                }
            }
        }
    `)

    // Check for any errors
    if (result.errors) {
        throw new Error(result.errors)
    }

    // Extract query results
    const tags = result.data.allGhostTag.edges
    const authors = result.data.allGhostAuthor.edges
    const pages = result.data.allGhostPage.edges
    const posts = result.data.allGhostPost.edges
    //const games = result.data.allInternalGameData.edges

    // Load templates
    const indexTemplate = path.resolve(`./src/templates/index.js`)
    const tagsTemplate = path.resolve(`./src/templates/tag.js`)
    const authorTemplate = path.resolve(`./src/templates/author.js`)
    const pageTemplate = path.resolve(`./src/templates/page.js`)
    const postTemplate = path.resolve(`./src/templates/post.js`)

    // Create tag pages
    tags.forEach(({ node }) => {
        const totalPosts = node.postCount !== null ? node.postCount : 0
        const numberOfPages = Math.ceil(totalPosts / postsPerPage)

        // This part here defines, that our tag pages will use
        // a `/tag/:slug/` permalink.
        node.url = `/tag/${node.slug}/`

        Array.from({ length: numberOfPages }).forEach((_, i) => {
            const currentPage = i + 1
            const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
            const nextPageNumber =
                currentPage + 1 > numberOfPages ? null : currentPage + 1
            const previousPagePath = prevPageNumber
                ? prevPageNumber === 1
                    ? node.url
                    : `${node.url}page/${prevPageNumber}/`
                : null
            const nextPagePath = nextPageNumber
                ? `${node.url}page/${nextPageNumber}/`
                : null

            createPage({
                path: i === 0 ? node.url : `${node.url}page/${i + 1}/`,
                component: tagsTemplate,
                context: {
                    // Data passed to context is available
                    // in page queries as GraphQL variables.
                    slug: node.slug,
                    limit: postsPerPage,
                    skip: i * postsPerPage,
                    numberOfPages: numberOfPages,
                    humanPageNumber: currentPage,
                    prevPageNumber: prevPageNumber,
                    nextPageNumber: nextPageNumber,
                    previousPagePath: previousPagePath,
                    nextPagePath: nextPagePath,
                },
            })
        })
    })

    // Create author pages
    authors.forEach(({ node }) => {
        const totalPosts = node.postCount !== null ? node.postCount : 0
        const numberOfPages = Math.ceil(totalPosts / postsPerPage)

        // This part here defines, that our author pages will use
        // a `/author/:slug/` permalink.
        node.url = `/author/${node.slug}/`

        Array.from({ length: numberOfPages }).forEach((_, i) => {
            const currentPage = i + 1
            const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
            const nextPageNumber =
                currentPage + 1 > numberOfPages ? null : currentPage + 1
            const previousPagePath = prevPageNumber
                ? prevPageNumber === 1
                    ? node.url
                    : `${node.url}page/${prevPageNumber}/`
                : null
            const nextPagePath = nextPageNumber
                ? `${node.url}page/${nextPageNumber}/`
                : null

            createPage({
                path: i === 0 ? node.url : `${node.url}page/${i + 1}/`,
                component: authorTemplate,
                context: {
                    // Data passed to context is available
                    // in page queries as GraphQL variables.
                    slug: node.slug,
                    limit: postsPerPage,
                    skip: i * postsPerPage,
                    numberOfPages: numberOfPages,
                    humanPageNumber: currentPage,
                    prevPageNumber: prevPageNumber,
                    nextPageNumber: nextPageNumber,
                    previousPagePath: previousPagePath,
                    nextPagePath: nextPagePath,
                },
            })
        })
    })

    const bggIdTagPrefix = 'hash-bgg-';
    const systemTagPrefix = 'hash-s-';

    // Create pages
    pages.forEach(({ node }) => {
        // This part here defines, that our pages will use
        // a `/:slug/` permalink.
        node.url = `/${node.slug}/`

        let bggIdTag = null
        let bggId = null

        if (node.featured)
        {
            const internalPageTags = node.tags.filter(tag => tag.visibility === "internal");
            pageTagSlugs = Array.from(internalPageTags, tag => tag.slug);
            bggIdTag = pageTagSlugs.find(slug => slug.startsWith(bggIdTagPrefix));

            if (bggIdTag) {
                let startIndex = bggIdTag.indexOf(bggIdTagPrefix) + bggIdTagPrefix.length
                let bggIdStr = bggIdTag.substring(startIndex)
                bggId = Number(bggIdStr)
            }
        }

        createPage({
            path: node.url,
            component: pageTemplate,
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
                bggIdTag: bggIdTag,
                bggId: bggId
            },
        })
    })

    
    // Create post pages
    posts.forEach(({ node }) => {
        // This part here defines, that our posts will use
        // a `/:slug/` permalink.
        node.url = `/${node.slug}/`

        const internalPostTags = node.tags.filter(tag => tag.visibility === "internal");
        const postTagSlugs = Array.from(internalPostTags, tag => tag.slug).filter(s => !s.startsWith(systemTagPrefix));

        const bggIdTags = postTagSlugs.filter(slug => slug.startsWith(bggIdTagPrefix));
        let bggIds = new Array();
        if (bggIdTags !== null && bggIdTags !== undefined && bggIdTags.length > 0) {
            bggIdTags.forEach(bggIdTag => {
                let startIndex = bggIdTag.indexOf(bggIdTagPrefix) + bggIdTagPrefix.length
                let bggIdStr = bggIdTag.substring(startIndex)
                bggIds.push(Number(bggIdStr))
            });
        }

        createPage({
            path: node.url,
            component: postTemplate,
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
                tags: postTagSlugs,
                bggIdTags: bggIdTags,
                bggIds: bggIds
            },
        })
    })

    const homePageTags = ["tarsasjatek-ajanlo","tarsasjatek-kritika","tarsasjatek-kiegeszitok","interju"];

    // Create pagination
    paginate({
        createPage,
        items: posts,
        itemsPerPage: postsPerPage,
        component: indexTemplate,
        pathPrefix: ({ pageNumber }) => {
            if (pageNumber === 0) {
                return `/`
            } else {
                return `/page`
            }
        },
        context: {
            homePageTags: homePageTags
        }
    })
}

exports.onCreateNode = async ({
    node,
    actions,
    store,
    createNodeId,
    cache
}) => {
    // Check that we are modifying right node types.
    const nodeTypes = [`GhostPost`, `GhostPage`];
    if (!nodeTypes.includes(node.internal.type)) {
        return;
    }

    const { createNode } = actions;

    if (node.feature_image) 
    {
        // Download image and create a File node with gatsby-transformer-sharp.
        const fileNode = await createRemoteFileNode({
            url: node.feature_image,
            store,
            cache,
            createNode,
            parentNodeId: node.id,
            createNodeId
        });

        if (fileNode) {
            // Link File node to GhostPost node at field image.
            node.localFeatureImage___NODE = fileNode.id;
        }
    }
};