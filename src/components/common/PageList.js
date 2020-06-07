import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

// Styles
import '../../styles/app.css'

const PageList = ({ data }) => {
    const featuredPages = data.allGhostPage.edges;

    return (
        <>
            <section className="page-list">
                <h2 className="home-title" style={{color: 'var(--color-bg)' }}>Polcunk</h2>
                <div className="page-list__container">

                    {featuredPages.map(({ node, i }) => (
                        <a href={node.slug} title={node.title} key={i} className="featured-page-card">
                            <Img fluid={node.localFeatureImage.childImageSharp.fluid} alt={node.title} className="featured-page-card-img" />
                            <p className="featured-page-card-excerpt">{node.excerpt}</p>
                        </a>
                    ))}

                </div>
            </section>
        </>
    )
}

PageList.propTypes = {
    data: PropTypes.shape({
        allGhostPage: PropTypes.object.isRequired,
    }).isRequired,
}

const PageListQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostPage {
                allGhostPage(
                    sort: { order: ASC, fields: [title] },
                    filter: { featured: {eq: true} }
                    ) {
                    edges {
                        node {
                            ...GhostPageFields
                            ...GatsbyImageSharpSinglePage
                        }
                    }
                }
            }
        `}
        render={data => <PageList data={data} {...props} />}
    />
)

export default PageListQuery
