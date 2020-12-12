import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { Tags } from '@tryghost/helpers-gatsby'
import Img from 'gatsby-image'

const PostCard = ({ post, featured, onlyImage }) => {
    const url = `/${post.slug}/`

    const featuredImage = post.localFeatureImage.childImageSharp.fluid;

    return (
        <Link to={url} className={onlyImage ? "post-card only-image" : "post-card"}>
            <header className="post-card-header">

                {
                    post.feature_image &&
                    <div className="post-card-image"><Img fluid={featuredImage} alt={post.title} /></div>
                }
                {
                   !onlyImage &&
                    <div className="post-card-head">
                        
                        <div className="post-card-tags">
                            { post.tags && <Tags post={post} visibility="public" autolink={false} /> }
                            <span className="post-card-date">
                                {new Intl.DateTimeFormat("hu-HU", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit"
                                }).format(new Date(post.published_at))}
                            </span>
                        </div>
                        
                        <h2 className="post-card-title">{post.title}</h2>
                    </div>
                }
            </header>
            {
                featured
                ? <section className="post-card-excerpt">{post.custom_excerpt}</section> 
                : null
            }
            {/* <footer className="post-card-footer">
                <div className="post-card-footer-left">
                    <div className="post-card-avatar">
                        {post.primary_author.profile_image ?
                            <img className="author-profile-image" src={post.primary_author.profile_image} alt={post.primary_author.name}/> :
                            <img className="default-avatar" src="/images/icons/avatar.svg" alt={post.primary_author.name}/>
                        }
                    </div>
                    <span>{ post.primary_author.name }</span>
                </div>
                <div className="post-card-footer-right">
                </div>
            </footer> */}
        </Link>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        feature_image: PropTypes.string,
        localFeatureImage: PropTypes.object,
        featured: PropTypes.bool,
        tags: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
            })
        ),
        excerpt: PropTypes.string.isRequired,
        primary_author: PropTypes.shape({
            name: PropTypes.string.isRequired,
            profile_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
}

export default PostCard
