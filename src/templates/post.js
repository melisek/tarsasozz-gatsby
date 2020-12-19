import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'
import AuthorCard from '../components/common/AuthorCard'
import PostCard from '../components/common/PostCard'
import GameDataCard from '../components/common/GameDataCard'
import Img from 'gatsby-image'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location }) => {
    const post = data.ghostPost;
    const relatedFeaturedPages = data.allGhostPage.edges;
    const partnerInfos = data.allGoogleSheetPartnersRow.edges;
    const public_tags = post.tags.filter(t => t.visibility === "public");
    const internalTags = post.tags.filter(t => t.visibility === "internal");
    const gameCategoryTags = internalTags.filter(t => !t.slug.startsWith('hash-'));
    const withoutGameData = post.tags.find(t => t.slug === 'hash-s-without-game-data');

    const gamesData = data.allInternalGameCollection.edges.slice(0,1);

    const featuredImage = data.ghostPost.localFeatureImage.childImageSharp.fluid;
    const author = post.primary_author;

    // TODO
    const relatedPosts = data.allGhostPost.edges;

    // const gameTags = internalTags.filter(t => t.slug.startsWith('hash-bgg-'));
    // const bestTagMatchKey = internalTags.length + 1;
    // const relatedPostsGrouped = data.allGhostPost.edges.reduce(function (res, p) {
    //     let commonGameTags = p.node.tags.filter(t => t.visibility === "internal" && gameTags.find(gt => gt.slug === t.slug));
    //     let key = '';
    //     if (commonGameTags.length === 0)
    //     {
    //         let commonTags = p.node.tags.filter(t => t.visibility === "internal" && internalTags.find(it => it.slug === t.slug));
    //         key = commonTags.length;
    //     }
    //     else {
    //         key = bestTagMatchKey;
    //     }

    //     if (!res[key]) {
    //         res[key] = [];
    //     }
    //     res[key].push(p);
    //     return res;
    // }, {});

    // const relatedPostMaxCount = 3;
    // let relatedPosts = [];
    // let relatedPostCount = 0;
    
    // if (relatedPostsGrouped[bestTagMatchKey]) {
    //     relatedPostsGrouped[bestTagMatchKey].forEach(p => {
    //         relatedPosts.push(p)
    //     });
    //     relatedPostCount = relatedPostsGrouped[bestTagMatchKey].length;
    // }

    // let groupIdx = internalTags.length;
    // while (relatedPostCount < relatedPostMaxCount){
    //     if (relatedPostsGrouped[groupIdx]) {
    //         for (let i = 0; relatedPostCount < relatedPostMaxCount && i < relatedPostsGrouped[groupIdx].length; i++) {
    //             relatedPosts.push(relatedPostsGrouped[groupIdx][i]);
    //             relatedPostCount++;
    //         }
    //     }
    //     groupIdx--;
    // }

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="article"
            />
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>

            <Layout>
                <div className="container">
                    <article className="content">
                        { post.feature_image ?
                            <figure className="post-feature-image">
                                <Img fluid={featuredImage} alt={post.title} />
                            </figure> 
                            : null 
                        }
                        
                        <section className="post-full-content">
                            <h1 className="content-title">{post.title}</h1>
                            <div className="content-header">
                                {author.profile_image ?
                                    <a href={`/author/${author.slug}`} title={author.name}>
                                        <div className="content-author-image" style={{backgroundImage: `url(${author.profile_image})`}}></div>
                                    </a>
                                    : null
                                }
                                <a href={`/author/${author.slug}`} title={author.name} style={{paddingLeft:"15px"}}>{author.name}</a>

                                <div className="content-published-date">
                                    {new Intl.DateTimeFormat("hu-HU", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit"
                                    }).format(new Date(post.published_at))}
                                </div>

                                <div className="content-tags">
                                    {public_tags.map((tag, i) => ( 
                                            <a href={`/tag/${tag.slug}`} title={tag.meta_title} key={i}>
                                                {tag.name}
                                            </a>
                                    ))}

                                    {gameCategoryTags.map((tag) => (
                                        <a className="game-category" id={tag.slug} key={tag.slug} href={`/tag/${tag.slug}/`}>{tag.name}</a>
                                    ))}
                                </div>
                            </div>   

                            {/* The main post content */ }
                            <section
                                className="content-body load-external-scripts">

                                {
                                    withoutGameData === undefined &&
                                    gamesData.map(({ node }) => {
                                        let gameDataSlug = node.slug;
                                        let page = relatedFeaturedPages.find(p => p.node.slug === gameDataSlug);
                                        let partner = partnerInfos.find(p => p.node.slug === post.slug)

                                        return <GameDataCard data={node} partner={partner?.node} page={page} key={node.gameId} />
                                    })
                                }

                                <div className={ withoutGameData === undefined ? 'content-body-text has-game-data' : `content-body-text`} dangerouslySetInnerHTML={{ __html: post.html }}/>
                            </section>

                        </section>
                    </article>

                    {
                        withoutGameData === undefined &&
                        //  card-list author-list
                        <footer className="post-footer"> 
                            {
                                post.authors.map((author, i) => (
                                    <AuthorCard author={author} key={i} />
                                ))
                            }
                        </footer>
                    }

                    {/* <section>
                        {
                            gamesData.length !== 0 &&
                        
                            <h2 className="sub-title">
                            A bejegyzésben szereplő {
                                gamesData.length > 1 
                                ? `társasjátékok`
                                : `társasjáték`
                            }
                            </h2>
                        }
                        <section className="play-feed">
                            {
                                gamesData.map(({ node }) => {
                                    let gameDataSlug = node.slug;
                                    let page = relatedFeaturedPages.find(p => p.node.slug === gameDataSlug);
                                    return <GameDataCard data={node} page={page} key={node.bggId} />
                                })
                            }
                        </section>
                    </section> */}

                    {
                        relatedPosts.length !== 0 ? 
                            <section>
                                <h2 className="sub-title">Kapcsolódó bejegyzések</h2>

                                <section className="post-feed">
                                    {relatedPosts.map(({ node }) => (
                                        <PostCard key={node.id} post={node} />
                                    ))}
                                </section>
                            </section>
                        : null
                    }
                </div>
            </Layout>
        </>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
        allGhostPost: PropTypes.object.isRequired,
        allGhostPage: PropTypes.object.isRequired,
        allInternalGameData: PropTypes.object.isRequired,
        allInternalGameCollection: PropTypes.object.isRequired,
        allGoogleSheetPartnersRow: PropTypes.object
    }).isRequired,
    location: PropTypes.object.isRequired,
}

// allGhostPost(
//     sort: { order: DESC, fields: [published_at] },
//     limit: 3,
//     filter: { slug: { ne: $slug }, tags: {elemMatch: {slug: {in: $tags } }}}
// ) {
//   edges {
//     node {
//         ...GhostPostCoreFields
//         ...GatsbyImageSharpSinglePost
//     }
//   }
// }

export default Post

export const postQuery = graphql`
    query($slug: String!, $tags: [String!], $bggIdTags: [String], $bggIds: [Int]) {
        ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
            localFeatureImage {
                childImageSharp {
                    fluid(
                        maxWidth: 1200
                        maxHeight: 700
                        cropFocus: CENTER
                    ) {
                        aspectRatio
                        src
                        srcSet
                        sizes
                        base64
                    }
                }
            }
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] },
            limit: 3,
            filter: { slug: { ne: $slug }, tags: {elemMatch: {slug: {in: $tags } }}}
        ) {
        edges {
            node {
                ...GhostPostCoreFields
                ...GatsbyImageSharpSinglePost
            }
        }
        }
        allGhostPage(
            sort: { order: ASC, fields: [title] },
            filter: { featured: {eq: true}, tags: {elemMatch: {slug: {in: $bggIdTags} } } }
            ) {
            edges {
                node {
                    ...GhostPageFields
                    ...GatsbyImageSharpSinglePage
                }
            }
        }
        allInternalGameData(filter: {bggId: {in: $bggIds }}) {
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
        allInternalGameCollection(filter: {gameId: {in: $bggIds }}) {
            edges {
                node {
                    averageRating
                    bggRating
                    gameId
                    id
                    image
                    thumbnail
                    rating
                    rank
                    playingTime
                    owned
                    numPlays
                    isExpansion
                    maxPlayers
                    minPlayers
                    name
                    yearPublished
                }
            }
        }
        allGoogleSheetPartnersRow {
            edges {
            node {
                link
                name
                slug
            }
            }
        }
    }
`
