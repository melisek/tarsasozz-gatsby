import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { Layout } from '../components/common'
import PostCard from '../components/common/PostCard'
import PlayCard from '../components/common/PlayCard'
import { MetaData } from '../components/common/meta'
import Img from 'gatsby-image'

import { Cog, Cogs } from 'styled-icons/fa-solid'
import { Cogs as IcoCogs } from 'styled-icons/icomoon' 

/**
* Single page (/:slug)
*
* This file renders a single page and loads all the content.
*
*/
const Page = ({ data, location }) => {
    const page = data.ghostPage;
    const relatedPosts = data.allGhostPost.edges;
    const featuredImage = data.ghostPage.localFeatureImage ? data.ghostPage.localFeatureImage.childImageSharp.fluid : null;

    // const plays = data.allInternalPlays.edges
    const games = data.allInternalGameData.edges

    const complexity = [ "Könnyű", "Normál", "Nehéz"];

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="website"
            />
            <Helmet>
                <style type="text/css">{`${page.codeinjection_styles}`}</style>
            </Helmet>
            <Layout>
                <div className="container">
                    { page.featured ? 
                        <section className="featured-page-grid">
                            <figure className="post-feature-image">
                                <Img fluid={featuredImage} alt={page.title} />
                            </figure> 

                            <article className="content col-gameinfo">
                                <div className="featured-page-full-content">
                                    {games.map(({ node, index }) => (
                                        <div key={index} className="game-data-wrapper">
                                            {page.tags.filter(t => !t.slug.startsWith('hash-')).map((tag) => (
                                                <a className="game-category" id={tag.slug} key={tag.slug} href={`/tag/${tag.slug}/`}>{tag.name}</a>
                                            ))}

                                        <h1 className="content-title">{page.title}</h1>

                                        <p className="game-excerpt">{page.excerpt}</p>

                                        <div className="game-data-grid">
                                            <div>
                                                <div className="game-icon icon-complexity" aria-hidden="true">
                                                    {
                                                    node.complexity === 1 ?
                                                        <Cog size="1.25em" />
                                                    : (node.complexity === 2 ?
                                                        <IcoCogs size="1.25em" />
                                                        :
                                                        <Cogs size="1.25em" />
                                                    )
                                                    }
                                                </div>
                                                <span className="game-data">{complexity[node.complexity - 1]}</span>
                                            </div>
                                            <div>
                                                <div className="game-icon icon-players" aria-hidden="true"></div>
                                                <span className="game-data">{node.minPlayers}-{node.maxPlayers} játékos</span>
                                            </div>
                                            <div>
                                                <div className="game-icon icon-time" aria-hidden="true"></div>
                                                <span className="game-data">{node.minTime}{ node.maxTime != null ? `-${node.maxTime}` : null } perc játékidő</span>
                                            </div>
                                            <div>
                                                <div className="game-icon icon-age" aria-hidden="true"></div>
                                                <span className="game-data">{node.age}+ éves kortól</span>
                                           </div>
                                        </div>
                                        </div>
                                    ))}

                                </div> 
                            </article>
                            {
                                relatedPosts.length !== 0 ? 

                                    <article className="col-post">
                                        <h2 className="sub-title">Itt írtunk a játékról:</h2>

                                        <section className="post-feed">
                                            {relatedPosts.map(({ node }) => (
                                                <PostCard key={node.id} post={node} />
                                            ))}
                                        </section>
                                    </article>

                                : null
                            }
                            {
                                page.html ?
                                    <section className="col-gallery">
                                        <h2 className="sub-title">Képeink:</h2>
                                        <section
                                            className="gallery-container load-external-scripts"
                                            dangerouslySetInnerHTML={{ __html: page.html }}
                                        />
                                    </section>
                                : null
                            }

                            {/* <section className="play-feed">
                                {plays.map(({ node, i }) => {
                                        let playGameId = node.gameId;
                                        let game = games.find(({ node }) => node.bggId === playGameId);
                                        
                                        return <PlayCard play={node} key={i} title={game.node.title} />
                                })}
                            </section> */}
                        </section>

                    : <article className="content">
                        { page.feature_image ?
                            <figure className="post-feature-image">
                                <img src={ page.feature_image } alt={ page.title } />
                            </figure> 
                            : null 
                        }
                        <section className="post-full-content">
                            <h1 className="content-title">{page.title}</h1>

                            {/* The main page content */}
                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{ __html: page.html }}
                            />
                        </section>
                        </article>
                    }
                </div>
            </Layout>
        </>
    )
}

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
        allGhostPost: PropTypes.object.isRequired,
        //allInternalPlays: PropTypes.object.isRequired,
        allInternalGameData: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

// allInternalPlays(filter: {gameId: {ne: null}}, sort: {fields: playDate, order: DESC}) {
//     edges {
//       node {
//         name
//         gameId
//         image
//         thumbnail
//         playDate
//         comments
//         players {
//           name
//           username
//           win
//         }
//       }
//     }
// }
export default Page

export const postQuery = graphql`
    query($slug: String!, $bggIdTag: String, $bggId: Int) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
            ...GatsbyImageSharpSinglePage
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] },
            limit: 3,
            filter: { tags: {elemMatch: {slug: {eq: $bggIdTag } } }}
        ) {
          edges {
            node {
                ...GhostPostFields
                ...GatsbyImageSharpPostCard
            }
          }
        }
        
        allInternalGameData(filter: {bggId: {eq: $bggId }}) {
            edges {
              node {
                bggId
                slug
                title
                minPlayers
                maxPlayers
                minTime
                maxTime
                age
                bggRating
                complexity
              }
            }
        }
    }
`
