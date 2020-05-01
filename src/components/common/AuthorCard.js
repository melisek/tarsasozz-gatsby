import React from 'react'
import PropTypes from 'prop-types'

const AuthorCard = ({ author }) => {
    const url = `/author/${author.slug}`;
    return (
        <div className="author-card">
            <div className="author-card-wrapper">
                <div>
                    {author.profile_image ?
                        <a href={url} title={author.name}>
                            <div className="content-author-image" style={{backgroundImage: `url(${author.profile_image})`}}></div>
                        </a>
                        : null
                    }
                    <div className={`author-card-badge ${author.slug}`}></div>
                    <a href={url} title={author.name}><h4>{author.name}</h4></a>
                </div>
                <p className="author-card-bio">{author.bio}</p>
                <p><a href={author.website} title="BoardGameGeek profil" className="btn" target="_blank">BoardGameGeek</a></p>
            </div>
        </div>
    )
}

AuthorCard.propTypes = {
    author: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        profile_image: PropTypes.string,
        website: PropTypes.string,
        bio: PropTypes.string
    }).isRequired,
}

export default AuthorCard
