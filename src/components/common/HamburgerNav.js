import React from 'react'
import PropTypes from 'prop-types'
import { reveal as Menu } from 'react-burger-menu'
import { Link } from 'gatsby'
import { Instagram, Facebook } from 'styled-icons/fa-brands'

var styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '36px',
      height: '30px',
      left: '36px',
      top: '36px'
    },
    bmBurgerBars: {
      background: '#e0dff7'
    },
    bmBurgerBarsHover: {
      background: '#e0dff7'
    },
    bmCrossButton: {
      height: '28px',
      width: '28px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%'
    },
    bmMenu: {
      background: 'var(--color-bg)',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em'
    },
    bmItem: {
      display: 'block',
      padding: '1em',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: '1.25em',
      color: 'var(--color-purple)'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
  }

const HamburgerNav = ({ data, fbUrl, instaUrl }) => (
    <>
        <Menu styles={ styles } pageWrapId={ "viewport-top" } outerContainerId={ "viewport" }>

            {data.map((navItem, i) => {
                if (navItem.url.match(/^\s?http(s?)/gi)) {
                    return <a className="menu-item" href={navItem.url} key={i} target="_blank" rel="noopener noreferrer">{navItem.label}</a>
                } else {
                    return <Link className="menu-item" to={navItem.url} key={i}>{navItem.label}</Link>
                }
            })}
            {
                <div className="menu-item">
                  <a href={ fbUrl } target="_blank" rel="noopener noreferrer">
                      <Facebook size="1.5em" />
                  </a>
                  &nbsp;
                  <a href={ instaUrl } target="_blank" rel="noopener noreferrer">
                      <Instagram size="1.5em" />
                  </a>
                </div>
            }
        </Menu>
    </>
)


HamburgerNav.propTypes = {
  data: PropTypes.arrayOf(
      PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
      }).isRequired,
  ).isRequired,
  fbUrl: PropTypes.string,
  instaUrl: PropTypes.string
}

export default HamburgerNav
