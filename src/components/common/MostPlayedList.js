// import React from 'react'
// import PropTypes from 'prop-types'
// import { StaticQuery, graphql } from 'gatsby'
// import Img from 'gatsby-image'
// import GameCard from './GameCard'

// // Styles
// import '../../styles/app.css'

// const MostPlayedList = ({ data }) => {
//     const plays = data.allInternalMostPlayedGames.edges
//     const games = data.allInternalGameData.edges
//     const pages = data.allGhostPage.edges

//     return (
//         <>
//             <div className="container mostplayed-list">
//                 <h2 className="home-title">Mostanában játszottuk</h2>
//                 <section className="play-feed">
//                     {plays.map(({ node }) => {
//                             let playGameId = node.gameId;
//                             let game = games.find(({ node }) => node.bggId === playGameId);
//                             let page = game !== undefined && game !== null 
//                                 ? pages.find(p => p.node.slug === game.node.slug)
//                                 : null;
                            
//                             return <GameCard play={node} page={page} key={playGameId} title={game?.node?.title} />
//                     })}
//                 </section>
//             </div>
//         </>
//     )
// }

// MostPlayedList.propTypes = {
//     data: PropTypes.shape({
//         allInternalMostPlayedGames: PropTypes.object.isRequired,
//         allInternalGameData: PropTypes.object.isRequired,
//         allGhostPage: PropTypes.object.isRequired,
//     }).isRequired,
// }

// const MostPlayedListQuery = props => (
//     <StaticQuery
//         query={graphql`
//             query MostPlayed {
//                 allInternalMostPlayedGames(limit: 9, filter: {gameId: {ne: null}}, sort: {fields: playDate, order: DESC}) {
//                     edges {
//                       node {
//                         name
//                         gameId
//                         image
//                         thumbnail
//                         playDate
//                         numPlays
//                       }
//                     }
//                 }
//                 allInternalGameData {
//                     edges {
//                       node {
//                         bggId
//                         slug
//                         title
//                       }
//                     }
//                 }
//                 allGhostPage {
//                     edges {
//                         node {
//                             ...GhostPageFields
//                             ...GatsbyImageSharpSinglePage
//                         }
//                     }
//                 }
//             }
            
//         `}
//         render={data => <MostPlayedList data={data} {...props} />}
//     />
// )

// export default MostPlayedListQuery
