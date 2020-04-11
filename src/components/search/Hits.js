import { Link } from 'gatsby'
import Img from 'gatsby-image'
import React, { Fragment } from 'react'
import { Highlight, Snippet } from 'react-instantsearch-dom'
import { connectHits } from 'react-instantsearch-dom'
import { Calendar } from 'styled-icons/octicons'
import { Tags } from 'styled-icons/fa-solid'

const postHit = hit => (
  <div>
    <Calendar size="1em" />
    &nbsp;
    <Highlight attribute="date" hit={hit} tagName="mark" />
    &emsp;
    <Tags size="1em" />
    &nbsp;
    {hit.tags.map((tag, index) => (
      <Fragment key={tag}>
        {index > 0 && `, `}
        {tag}
      </Fragment>
    ))}
  </div>
)

export default connectHits(function HitComp({ type, hits, onClick }) {
  const extend = { postHit }[type]
  return hits.map(hit => (
    <div key={hit.objectID}>
      <Link to={`/${hit.slug}`} onClick={onClick}>
        <Img fluid={hit.localFeatureImage.childImageSharp.fluid} alt={hit.title} className="hit-img" />
        <h4>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </h4>
      </Link>
      {extend && extend(hit)}
      <Fragment>
        <span className="search-hit-publish-date">
        {new Intl.DateTimeFormat("hu-HU", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit"
                            }).format(new Date(hit.published_at))}
        </span>
      </Fragment>      
      {hit.tags.filter(t => !t.slug.startsWith('hash-')).map((tag) => (
        <Fragment key={tag.slug}>
          <a className="search-hit-tag-small" href={`/tag/${tag.slug}/`}>{tag.name}</a>
        </Fragment>
      ))}
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
    </div>
  ))
})