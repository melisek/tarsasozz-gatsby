import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'


// Styles
import '../../styles/app.css'

/**
* Main layout component
*
* The Layout component wraps around each page and template.
* It also provides the header, footer as well as the main
* styles, and meta data for each page.
*
*/
const PageList = ({ data }) => {
    const featuredPages = data.allGhostPage.edges;

    console.log(featuredPages);
    return (
        <>
            <section className="page-list">
                <h2>Kiemelt társasjátékok</h2>
                <div className="page-list__container">

                    {featuredPages.map(({ node }) => (
                        <a href={node.slug} title={node.title}>
                            <img src={node.feature_image} alt={node.title} />
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
                        }
                    }
                }
            }
        `}
        render={data => <PageList data={data} {...props} />}
    />
)

export default PageListQuery
