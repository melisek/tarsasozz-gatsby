import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import PlayCard from './PlayCard'

// Styles
import '../../styles/app.css'

const PlayList = ({ data }) => {
    const plays = data.allInternalMostPlayedGames.edges
    const pages = data.allGhostPage.edges

    return (
        <>
            <h2>Legutóbb játszott társasjátékok</h2>
            <div className="container">
                <section className="play-feed">
                    {plays.map(({ node, i }) => {
                            let playGameId = node.gameId;
                            // TODO
                            let page = null;
                            
                            return <PlayCard play={node} page={page} key={i} />
                    })}
                </section>
            </div>
        </>
    )
}

PlayList.propTypes = {
    data: PropTypes.shape({
        allInternalMostPlayedGames: PropTypes.object.isRequired,
        allGhostPage: PropTypes.object.isRequired,
    }).isRequired,
}

const PlayListQuery = props => (
    <StaticQuery
        query={graphql`
            query Plays {
                allInternalMostPlayedGames(limit: 9, filter: {gameId: {ne: null}}, sort: {fields: playDate, order: DESC}) {
                    edges {
                      node {
                        name
                        gameId
                        image
                        thumbnail
                        playDate
                      }
                    }
                }
                allGhostPage {
                    edges {
                        node {
                            ...GhostPageFields
                            ...GatsbyImageSharpSinglePage
                        }
                    }
                }
            }
            
        `}
        render={data => <PlayList data={data} {...props} />}
    />
)

export default PlayListQuery
