import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'
import AuthorCard from '../components/common/AuthorCard'
import PostCard from '../components/common/PostCard'
import { Tags } from '@tryghost/helpers-gatsby'
import Img from 'gatsby-image'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location }) => {
    const post = data.ghostPost;
    const relatedPosts = data.allGhostPost.edges;
    const relatedFeaturedPages = data.allGhostPage.edges;
    const public_tags = post.tags.filter(t => {
        return t.visibility === "public"
    });

    const featuredImage = data.ghostPost.localFeatureImage.childImageSharp.fluid;
    const author = post.primary_author;
    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="article"
            />
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>
            <Layout>
                <div className="container">
                    <article className="content">
                        { post.feature_image ?
                            <figure className="post-feature-image">
                                <Img fluid={featuredImage} alt={post.title} />
                            </figure> 
                            : null 
                        }
                        <section className="post-full-content">
                            <h1 className="content-title">{post.title}</h1>

                            <div className="content-header">
                                {author.profile_image ?
                                    <a href={`/author/${author.slug}`} title={author.name}>
                                        <div className="content-author-image" style={{backgroundImage: `url(${author.profile_image})`}}></div>
                                    </a>
                                    : null
                                }
                                <a href={`/author/${author.slug}`} title={author.name} style={{paddingLeft:"15px"}}>{author.name}</a>

                                <div className="content-published-date">
                                    {new Intl.DateTimeFormat("hu-HU", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit"
                                    }).format(new Date(post.published_at))}
                                </div>

                                <div className="content-tags">
                                    {public_tags.map((tag, i) => {     
                                        return (
                                            <a href={`/tag/${tag.slug}`} title={tag.meta_title} key={i}>
                                                {tag.name}
                                            </a>
                                        ) 
                                    })}
                                </div>

                            </div>   

                            {/* The main post content */ }
                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{ __html: post.html }}
                            />

                        </section>

                    </article>

                    <footer className="post-footer">
                        <AuthorCard author={post.primary_author} />

                            {
                                relatedFeaturedPages.map(({ node }) => (
                                    <div className="featured-page-item"> 
                                        {
                                            node.feature_image &&
                                            <Link to={node.slug} title={node.title}><div className="page-card-image" style={{
                                                    backgroundImage: `url(${node.feature_image})` ,
                                                }}></div>
                                            </Link>
                                        }
                                        
                                        <Link to={node.slug} title={node.title}><h3>{node.title}</h3></Link>
                                    </div>
                                ))
                            }

                    </footer>

                    {
                        relatedPosts.length !== 0 ? 
                            <section>
                                <h2>Hasonló társasjátékok</h2>

                                <section className="post-feed">
                                    {relatedPosts.map(({ node }) => (
                                        <PostCard key={node.id} post={node} />
                                    ))}
                                </section>
                            </section>
                        : null
                    }                

                </div>
            </Layout>
        </>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
        allGhostPost: PropTypes.object.isRequired,
        allGhostPage: PropTypes.object.isRequired
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Post

export const postQuery = graphql`
    query($slug: String!, $tags: [String!]) {
        ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
            localFeatureImage {
                childImageSharp {
                    fluid(
                        maxWidth: 1200
                        maxHeight: 700
                        cropFocus: CENTER
                    ) {
                        aspectRatio
                        src
                        srcSet
                        sizes
                        base64
                    }
                }
            }
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] },
            limit: 3,
            filter: { slug: { ne: $slug }, tags: {elemMatch: {slug: {in: $tags} } }}
        ) {
          edges {
            node {
                ...GhostPostFields
                ...GatsbyImageSharpSinglePost
            }
          }
        }
        allGhostPage(
            sort: { order: ASC, fields: [title] },
            filter: { featured: {eq: true}, tags: {elemMatch: {slug: {in: $tags} } } }
            ) {
            edges {
                node {
                    ...GhostPageFields
                }
            }
        }
    }
`
