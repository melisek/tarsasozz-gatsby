import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { ArrowIosBackOutline, ArrowIosForwardOutline } from 'styled-icons/evaicons-outline'

const Pagination = ({ pageContext }) => {
    const { previousPagePath, nextPagePath, humanPageNumber, numberOfPages } = pageContext

    return (
        <nav className="pagination" role="navigation">
            <div className="pagination-wrapper">
                {previousPagePath && (

                        <Link to={previousPagePath} rel="prev">
                                <ArrowIosBackOutline size="1.25em" />
                                Újabb bejegyzések
                        </Link>

                )}
                
                {nextPagePath && (

                        <Link to={nextPagePath} rel="next">
                                Régebbi bejegyzések <ArrowIosForwardOutline size="1.25em" />
                        </Link>
                )}
            </div>
        </nav>
    )
}

Pagination.propTypes = {
    pageContext: PropTypes.object.isRequired,
}

export default Pagination
