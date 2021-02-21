import React from "react"
export const onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  pluginOptions
) => {
  setHeadComponents([
    <script
			key="splide-js"
      src="https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/js/splide.min.js"
      type="text/javascript"/>,
    <script
    key="mediumzoom"
    src="https://cdn.jsdelivr.net/npm/medium-zoom@1.0.5/dist/medium-zoom.min.js"
    type="text/javascript" />,
    <link
    key="splide-css" 
    href="https://cdn.jsdelivr.net/npm/@splidejs/splide@2.4.21/dist/css/splide.min.css"
    rel="stylesheet" type="text/css" />,
    <link
    key="splide-theme-css" 
    href="https://cdn.jsdelivr.net/npm/@splidejs/splide@2.4.21/dist/css/themes/splide-skyblue.min.css"
    rel="stylesheet" type="text/css" />
  ])
  setPostBodyComponents([
    <script
    key="plugin-init"
    defer={true}
    dangerouslySetInnerHTML={{
      __html: `
        setTimeout(function() {
          var slider = document.getElementById('image-slider');
          if(slider !== null && slider !== undefined)
          {
            new Splide( '#image-slider', {
                gap: '1.75em'
              } ).mount(); 
          }
        }, 5000)
    `,
    }}
  />
  ])
}