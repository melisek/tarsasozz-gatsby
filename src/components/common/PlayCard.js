import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { Tags } from '@tryghost/helpers-gatsby'
import Img from 'gatsby-image'

const PlayCard = ({ play, page, title }) => {

    let gameTitle = play.name
    let gameHasPage = false

    if (page !== undefined && page !== null)
    {
        gameTitle = page.node.title
        gameHasPage = true
    }
    if (title !== undefined && title !== null)
    {
        gameTitle = title
    }

    return (
        <a href={gameHasPage ? `/${page.node.slug}` : `https://boardgamegeek.com/boardgame/${play.gameId}/`} className="play-card" target={gameHasPage ? null : "_blank"}>
            <header className="play-card-header">
                <div className="play-card-image">
                    { gameHasPage
                        ? <Img fluid={page.node.localFeatureImage.childImageSharp.fluid} alt={gameTitle} />
                        : <img src={play.thumbnail} alt={gameTitle} />
                    }
                </div>
                <div className="play-card-head">
                    <h3 className="play-card-title">{gameTitle}</h3>
                </div>
            </header>

            <section className="play-card-content">
                <div className="play-card-date">
                    { new Intl.DateTimeFormat("hu-HU", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit"
                                    }).format(new Date(play.playDate))
                    }
                </div>

                {/* <div className="play-card-players">
                    {play.players.map((player, i) => 
                        <span key={i}>
                        {
                            player.username !== null && player.username !== "" ?
                            <a href={`https://boardgamegeek.com/user/${player.username}`}>
                                <span title={player.win ? "Nyertes" : null} style={player.win ? {fontWeight: "bold"} : null }>
                                    {player.name}
                                </span>
                            </a>
                            : <span style={player.win ? {fontWeight: "bold"} : null }>{player.name}</span>
                        }
                        
                        <span>{i !== play.players.length - 1 ? `, ` : null}</span>
                        </span>
                    )}
                </div> */}
            </section>
        </a>
    )
}

PlayCard.propTypes = {
    play: PropTypes.object.isRequired,
    page: PropTypes.object,
    title: PropTypes.string
}

export default PlayCard
