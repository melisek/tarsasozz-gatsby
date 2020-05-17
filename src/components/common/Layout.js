import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Link, StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

import { ThemeProvider } from 'styled-components'
import theme from '../../utils/theme'
import Search from '../search'
import { Instagram, Facebook } from 'styled-icons/fa-brands'

import { Navigation } from '.'

import CookieConsent from 'react-cookie-consent'

const searchIndices = [
    { name: process.env.GATSBY_ALGOLIA_INDEX_NAME, title: `Bejegyzések` },
  ]

// Styles
import '../../styles/app.css'

/**
* Main layout component
*
* The Layout component wraps around each page and template.
* It also provides the header, footer as well as the main
* styles, and meta data for each page.
*
*/
const DefaultLayout = ({ data, children, bodyClass, isHome }) => {
    const site = data.allGhostSettings.edges[0].node
    const facebookUrl = site.facebook ? `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}` : null
    const instagramUrl = `https://www.instagram.com/tarsasozz/`
    return (
        <>
            <Helmet>
                <html lang={site.lang} />
                <style type="text/css">{`${site.codeinjection_styles}`}</style>
                <body className={bodyClass} />
            </Helmet>

            <CookieConsent
                    location="bottom"
                    style={{ background: "#444471" }}
                    buttonStyle={{ background: "#82cecd" }}
                    buttonClasses="btn"
                    declineButtonClasses="btn"
                    declineButtonStyle={{ background: "#dd708c" }}
                    enableDeclineButton
                    flipButtons
                    buttonText="✔ Engedélyezem"
                    declineButtonText="⨉ Elutasítom"
                    cookieName="gatsby-gdpr-google-analytics">
                        <div className="container">
                        🍪 Weboldalunk sütiket (cookie-kat) tárol a számítógépeden. Ezek a sütik információt tárolnak arról, hogyan böngészed weboldalunkat, és lehetővé teszik, hogy visszatérő látogatóként azonosíthassunk.
             Ezt az információt a weboldal felhasználói élményének fokozására, illetve látogatói analitika készítésére használjuk.
              Amennyiben ezt elutasítod, a weboldal nem tárol információt rólad, csupán az elutasítás tényéről kerül egy süti mentésre a böngésződben. 
                        </div>
            </CookieConsent>

            <div className="viewport">

                <div className="viewport-top">
                    {/* The main header section on top of the screen  ${site.cover_image} */}
                    <header className={isHome ? `site-head site-head-home` : `site-head`} style={isHome? { ...site.cover_image && {} } : {} }>
                        <div className="container">
                            <div className="site-mast">
                                <div className="site-mast-left">
                                    <Link to="/">
                                        {site.logo ?
                                            <img className="site-logo" src={site.logo} alt={site.title} />
                                            : <Img fixed={data.file.childImageSharp.fixed} alt={site.title} />
                                        }
                                    </Link>
                                </div>
                                <div className="site-mast-right">

                                    <nav className="site-nav">
                                        <div className="site-nav-left">
                                        
                                            {/* The navigation items as setup in Ghost */}
                                            <Navigation data={site.navigation} navClass="site-nav-item" />
                                        </div>
                                        <div className="site-nav-right">
                                            {/* <Link className="site-nav-button" to="/about">About</Link> */}
                                        </div>
                                    </nav>

                                    <ThemeProvider theme={theme(false)}>
                                        <Search collapse indices={searchIndices} />
                                    </ThemeProvider>

                                    {
                                        <a href={ facebookUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                            <Facebook size="1em" />
                                        </a>
                                    }

                                    {
                                        <a href={ instagramUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                            <Instagram size="1em" />
                                        </a>
                                    }

                                </div>
                            </div>
                            { isHome ?
                                <div className="site-banner">
                                    <div className="site-banner-left">
                                        <div className="site-banner-container">
                                            <h1 className="site-banner-title">{site.title}</h1>
                                            <p className="site-banner-desc">{site.description}</p>
                                        </div>
                                    </div>
                                    <div className="site-banner-right">
                                        <div className="site-banner-categories">
                                            <a className="site-banner-category" id="csaladi" href="/tag/csaladi-tarsasjatekok/"><div><span className="site-banner-category-title">#családi</span></div></a>
                                            <a className="site-banner-category site-banner-green" id="kooperativ" href="/tag/kooperativ-tarsasjatekok/"><div ><span className="site-banner-category-title">#kooperatív</span></div></a>

                                            <a className="site-banner-category" id="strategiai" href="/tag/strategiai-tarsasjatekok/"><div><span className="site-banner-category-title">#stratégiai</span></div></a>
                                            <a className="site-banner-category" id="party" href="/tag/party-tarsasjatekok/"><div ><span className="site-banner-category-title">#party</span></div></a>
                                        </div>
                                    </div>
                                </div> :
                                null
                                }
                        </div>
                    </header>

                    <main className="site-main">
                        {/* All the main content gets inserted here, index.js, post.js */}
                        {children}
                    </main>

                </div>

                <div className="viewport-bottom">
                    {/* The footer at the very bottom of the screen */}
                    <footer className="site-foot">
                        <div className="site-foot-nav container">
                            <div className="site-foot-nav-left">
                                <Link to="/">
                                    {site.logo ?
                                        <img className="site-logo" src={site.logo} alt={site.title} />
                                        : <Img fixed={data.file.childImageSharp.fixed} alt={site.title} />
                                    }
                                </Link><br/>
                                <Link to="/">{site.title}</Link> © 2020
                            </div>
                            <div className="site-foot-nav-center">
                                <Navigation data={site.navigation} navClass="site-foot-nav-item" />

                            </div>
                            <div className="site-foot-nav-right">
                                {
                                    <a href={ facebookUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                        <Facebook size="1.5em" />
                                    </a>
                                }
                                {
                                    <a href={ instagramUrl } className="site-nav-item" target="_blank" rel="noopener noreferrer">
                                        <Instagram size="1.5em" />
                                    </a>
                                }
                            </div>
                        </div>
                    </footer>

                </div>
            </div>

        </>
    )
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
    bodyClass: PropTypes.string,
    isHome: PropTypes.bool,
    data: PropTypes.shape({
        file: PropTypes.object,
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
}

const DefaultLayoutSettingsQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettings {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                file(relativePath: {eq: "ghost-icon.png"}) {
                    childImageSharp {
                        fixed(width: 30, height: 30) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
            }
        `}
        render={data => <DefaultLayout data={data} {...props} />}
    />
)

export default DefaultLayoutSettingsQuery
