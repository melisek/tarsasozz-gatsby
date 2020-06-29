import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

import { Cog, Cogs, HourglassHalf, Child, Star } from 'styled-icons/fa-solid'
import { Cogs as IcoCogs, Calendar } from 'styled-icons/icomoon' 
import { Group, HomeHeart } from 'styled-icons/remix-fill'

const GameDataCard = ({ data, partner, page }) => {
    let gameTitle = data.name

    //const complexity = [ "egyszerű", "közepes", "nehéz"];

    return (
        <div className="play-card game-data-card">
            <header className="play-card-header">
                <div className="play-card-head">
                    <h3 className="game-data-card-title">{gameTitle}</h3>
                </div>
            </header>

            <section className="play-card-content">
                <div className="game-data-grid">
                    {/* <div>
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
                    </div> */}
                    <div title="Kiadás éve">
                        <div className="game-icon icon-players" aria-hidden="true">
                            <Calendar size="1.25em" />
                        </div>
                        <span className="game-data">{data.yearPublished}</span>
                    </div>
                    <div title="Játékosok száma">
                        <div className="game-icon icon-players" aria-hidden="true">
                            <Group size="1.25em" />
                        </div>
                        <span className="game-data">{data.minPlayers}-{data.maxPlayers} fő</span>
                    </div>
                    <div title="Játékidő">
                        <div className="game-icon icon-time" aria-hidden="true">
                            <HourglassHalf size="1.25em" />
                        </div>
                        <span className="game-data">~{data.playingTime} perc</span>
                    </div>
                    {/* <div>
                        <div className="game-icon icon-age" aria-hidden="true">
                            <Child size="1.25em" />
                        </div>
                        <span className="game-data">{data.age}+ év</span>
                    </div> */}
                    <div title="Értékelés">
                        <div className="game-icon icon-age" aria-hidden="true">
                            <Star size="1.25em" />
                        </div>
                        <span className="game-data">{ data.rating !== null && data.rating > 0 ? `${data.rating}/10 | ` : null}<a href={`https://boardgamegeek.com/boardgame/${data.gameId}/`} target="_blank">BGG átlag: {data.averageRating.toFixed(2)}</a></span>
                    </div>
                    { 
                        partner !== undefined && partner !== null &&
                            <div title={`A társasjátékot a ${partner.name}tól kaptuk kipróbálásra`}>
                                <div className="game-icon icon-age" aria-hidden="true">
                                    <HomeHeart size="1.25em" />
                                </div>
                                <span className="game-data"><a href={partner.link} target="_blank">{partner.name}</a></span>
                            </div>
                    }

                    { 
                        partner === null && page !== undefined && page !== null &&
                            <div>
                                <div className="game-icon icon-age" aria-hidden="true">
                                    <HomeHeart size="1.25em" />
                                </div>
                                <span className="game-data"><a href={`/${page.node.slug}`} target="_blank">Adatlap</a></span>
                            </div>
                    }
                </div>
            </section>
        </div>
    )
}

GameDataCard.propTypes = {
    data: PropTypes.object.isRequired,
    partner: PropTypes.object,
    page: PropTypes.object
}

export default GameDataCard
