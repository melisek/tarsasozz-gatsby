import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { Layout } from '../components/common'
import PostCard from '../components/common/PostCard'
import { MetaData } from '../components/common/meta'
import Img from 'gatsby-image'

/**
* Single page (/:slug)
*
* This file renders a single page and loads all the content.
*
*/
const Page = ({ data, location }) => {
    const page = data.ghostPage;
    const relatedPosts = data.allGhostPost.edges;
    const featuredImage = data.ghostPage.localFeatureImage?.childImageSharp.fluid;

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="website"
            />
            <Helmet>
                <style type="text/css">{`${page.codeinjection_styles}`}</style>
            </Helmet>
            <Layout>
                <div className="container">
                    { page.featured ? 
                        <section class="featured-page-grid">
                            <figure className="post-feature-image">
                                <Img fluid={featuredImage} alt={page.title} />
                            </figure> 

                            <article className="content col-2">
                                <div class="featured-page-full-content">
                                    <h1 className="content-title">{page.title}</h1>
                                    <div className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{ __html: page.html }}></div>
                                </div> 
                            </article>
                            {
                                relatedPosts.length !== 0 ? 

                                    <article className="col-3">
                                        <h2>Itt írtunk a játékról:</h2>

                                        <section className="post-feed">
                                            {relatedPosts.map(({ node }) => (
                                                <PostCard key={node.id} post={node} />
                                            ))}
                                        </section>
                                    </article>

                                : null
                            } 
                        </section>

                    : <article className="content">
                        { page.feature_image ?
                            <figure className="post-feature-image">
                                <img src={ page.feature_image } alt={ page.title } />
                            </figure> 
                            : null 
                        }
                        <section className="post-full-content">
                            <h1 className="content-title">{page.title}</h1>

                            {/* The main page content */}
                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{ __html: page.html }}
                            />
                        </section>
                        </article>
                    }
                </div>
            </Layout>
        </>
    )
}

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
        allGhostPost: PropTypes.object.isRequired
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Page

export const postQuery = graphql`
    query($slug: String!, $tags: [String!]) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
            ...GatsbyImageSharpSinglePage
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] },
            limit: 3,
            filter: { tags: {elemMatch: {slug: {in: $tags} } }}
        ) {
          edges {
            node {
                ...GhostPostFields
                ...GatsbyImageSharpPostCard
            }
          }
        }
    }
`
