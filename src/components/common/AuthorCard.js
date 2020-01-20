import React from 'react'
import PropTypes from 'prop-types'

const AuthorCard = ({ author }) => {
    const url = `/author/${author.slug}`;
    return (
        <div className="author-card">
                {author.profile_image ?
                    <a href={url} title={author.name}>
                        <div className="content-author-image" style={{backgroundImage: `url(${author.profile_image})`}}></div>
                    </a>
                    : null
                }
                <a href={url} title={author.name}><h4>{author.name}</h4></a>
                <p>{author.bio}</p>
                <p><a href={author.website} title="BoardGameGeek profil" target="_blank">BGG</a></p>
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
