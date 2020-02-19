import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

// Styles
import '../../styles/app.css'

const GamePlays = ({ data }) => {
    const plays = data.allInternalPlays.edges;
    console.log(plays)
    return (
        <>
            <section className="page-list">
                <h2>Legutóbb játszott társasjátékok</h2>
                <div className="page-list__container">

                    {plays.map(({ node }) => (
                        <p>{node.name} {node.playDate} {node.comments}
                        {node.players.map(player => (
                            player.username !== null && player.username !== "" ?
                            <a href={`https://boardgamegeek.com/user/${player.username}`}>
                                <span>{player.name}</span>
                            </a>
                            : <span>{player.name}</span>
                        ))}
                        </p>
                    ))}

                </div>
            </section>
        </>
    )
}

GamePlays.propTypes = {
    data: PropTypes.shape({
      allInternalPlays: PropTypes.object.isRequired,
    }).isRequired,
}

const GamePlaysQuery = props => (
    <StaticQuery
        query={graphql`
            query GamePlays {
                allInternalPlays(limit: 10, filter: {gameId: {ne: null}}, sort: {fields: playDate, order: DESC}) {
                    edges {
                      node {
                        name
                        gameId
                        playDate
                        comments
                        players {
                          name
                          username
                          win
                        }
                      }
                    }
                  }
            }
        `}
        render={data => <GamePlays data={data} {...props} />}
    />
)

export default GamePlaysQuery
