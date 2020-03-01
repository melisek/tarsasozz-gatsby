import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { Tags } from '@tryghost/helpers-gatsby'
import Img from 'gatsby-image'

const GameCard = ({ play, page, title }) => {

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
                        : <img src={play.image} alt={gameTitle} />
                    }
                </div>
                <div className="play-card-head">
                    <h3 className="play-card-title">{gameTitle}</h3>
                </div>
            </header>

            <section className="play-card-content">
                <div className="play-card-date">
                    {play.numPlays} alkalommal
                </div>
            </section>
        </a>
    )
}

GameCard.propTypes = {
    play: PropTypes.object.isRequired,
    page: PropTypes.object,
    title: PropTypes.string
}

export default GameCard
