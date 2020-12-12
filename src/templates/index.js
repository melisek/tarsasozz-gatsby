import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, Pagination, PageList, MostPlayedList } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Main index page (home page)
*
* Loads all posts from Ghost and uses pagination to navigate through them.
* The number of posts that should appear per page can be setup
* in /utils/siteConfig.js under `postsPerPage`.
*
*/
const Index = ({ data, location, pageContext }) => {
    const featuredPost = data.ghostPost
    const posts = data.allposts.edges
    const listPosts = data.listposts.edges

    return (
        <>
            <MetaData location={location} />
            <Layout isHome={true}>
                <div className="container">
                    <section className="post-feed">
                        {
                            featuredPost &&
                            <div className="post-card-featured">
                                <PostCard key={featuredPost.id} post={featuredPost} featured={true} />
                            </div>
                        }

                        {posts.map(({ node }) => (
                            // The tag below includes the markup for each post - components/common/PostCard.js
                            <PostCard key={node.id} post={node} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </div>

                {
                    listPosts && listPosts.length > 0 &&
                    <div className="container list-post-list">
                        <h2 className="home-title">(Le)Játszási lista</h2>
                        <section className="post-feed">
                            {listPosts.map(({ node }) => (
                                // The tag below includes the markup for each post - components/common/PostCard.js
                                <PostCard key={node.id} post={node} onlyImage={true} />
                            ))}
                        </section>
                    </div>
                }

                <PageList />

                <MostPlayedList />
            </Layout>
        </>
    )
}

Index.propTypes = {
    data: PropTypes.shape({
        allposts: PropTypes.object.isRequired,
        listposts: PropTypes.object.isRequired,
        ghostPost: PropTypes.object.isRequired
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
}

export default Index

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination
export const pageQuery = graphql`
  query GhostPostQuery($limit: Int!, $skip: Int!, $homePageTags: [String]) {
    allposts: allGhostPost(
        sort: { order: DESC, fields: [published_at] },
        filter: { featured: {eq: false}, tags: {elemMatch: {slug: { in: $homePageTags }}}},
        limit: $limit,
        skip: $skip
    ) {
      edges {
        node {
          ...GhostPostCoreFields
          ...GatsbyImageSharpPostCard
        }
      }
    }
    listposts: allGhostPost(
        sort: { order: DESC, fields: [published_at] },
        filter: { tags: {elemMatch: {slug: { eq: "tarsasjatek-lista" }}} },
        limit: 3
    ) {
      edges {
        node {
          ...GhostPostCoreFields
          ...GatsbyImageSharpPostCard
        }
      }
    }
    ghostPost(featured: { eq: true }) {
        ...GhostPostFields
        ...GatsbyImageSharpSinglePost
    }
  }
`
