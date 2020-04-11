const postsQuery = `{
    allGhostPost {
      edges {
        node {
          objectID: id
          title
          slug
          excerpt
          plaintext
          localFeatureImage {
            childImageSharp {
                fluid(
                    maxWidth: 500
                    maxHeight: 320
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
          published_at
          tags {
            name
            slug
          }
        }
      }
    }
  }`;
  
  const queries = [
    {
      query: postsQuery,
      transformer: ({ data }) => data.allGhostPost.edges.map(({ node }) => node)
    },
  ];


  module.exports = queries