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
                <section className="card-list">
                    {featuredPages.map(({ node }) => (
                        
                        <article className="card" key={node.slug}>
                            <header className="card-header">
                                <a href={node.slug} title={node.title}>
                                    <h2>{node.title}</h2>
                                </a>
                            </header>

                            <div className="card-pre-content">
                                <div className="card-img">
                                    <a href={node.slug} title={node.title}>
                                        <Img fluid={node.localFeatureImage.childImageSharp.fluid} alt={node.title} className="featured-page-card-img" />
                                    </a>
                                </div>
                                
                                <div className="tags">
                                    {node.tags.filter(t => !t.slug.startsWith('hash-')).map((tag, i) => (
                                        <a className="game-category" id={tag.slug} key={i} href={`/tag/${tag.slug}/`}>{tag.name}</a>
                                    ))}
                                </div>
                            </div>

                            <p className="featured-page-card-excerpt">{node.excerpt}</p>

                        </article>
                    ))}
                </section>
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
