import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

import { Cog, Cogs, HourglassHalf, Child  } from 'styled-icons/fa-solid'
import { Cogs as IcoCogs } from 'styled-icons/icomoon' 
import { Group } from 'styled-icons/remix-fill'

const GameDataCard = ({ data, page }) => {
    let gameTitle = data.title
    let gameHasPage = false

    if (page !== undefined && page !== null)
    {
        gameTitle = page.node.title
        gameHasPage = true
    }

    const complexity = [ "egyszerű", "közepes", "nehéz"];
    
    return (
        <a href={gameHasPage ? `/${page.node.slug}` : `https://boardgamegeek.com/boardgame/${data.bggId}/`} className="play-card" target={gameHasPage ? null : "_blank"}>
            <header className="play-card-header">
                { gameHasPage &&
                    <div className="play-card-image">
                        <Img fluid={page.node.localFeatureImage.childImageSharp.fluid} alt={gameTitle} />
                    </div>
                }
                <div className="play-card-head">
                    <h3 className="play-card-title">{gameTitle}</h3>
                </div>
            </header>

            <section className="play-card-content">
                <div className="game-data-grid">
                    <div>
                        <div className="game-icon icon-complexity" aria-hidden="true">
                            {
                            data.complexity === 1 ?
                                <Cog size="1.25em" />
                            : (data.complexity === 2 ?
                                <IcoCogs size="1.25em" />
                                :
                                <Cogs size="1.25em" />
                            )
                            }
                        </div>
                        <span className="game-data">{complexity[data.complexity - 1]}</span>
                    </div>
                    <div>
                        <div className="game-icon icon-players" aria-hidden="true">
                            <Group size="1.25em" />
                        </div>
                        <span className="game-data">{data.minPlayers}-{data.maxPlayers} fő</span>
                    </div>
                    <div>
                        <div className="game-icon icon-time" aria-hidden="true">
                            <HourglassHalf size="1.25em" />
                        </div>
                        <span className="game-data">{data.minTime}{ data.maxTime != null ? `-${data.maxTime}` : null } perc</span>
                    </div>
                    <div>
                        <div className="game-icon icon-age" aria-hidden="true">
                            <Child size="1.25em" />
                        </div>
                        <span className="game-data">{data.age}+ év</span>
                    </div>
                </div>
            </section>
        </a>
    )
}

GameDataCard.propTypes = {
    data: PropTypes.object.isRequired,
    page: PropTypes.object
}

export default GameDataCard
