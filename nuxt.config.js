
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'hsian的个人博客 - atlansic.com',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'keywords', content: '前端，web前端，html，css，javascript' },
      { hid: 'description', name: 'description', content: 'atlansic的博客是一个关注前端技术的网站, 分享HTML、CSS、Javascript、typescript、Nodejs等编程技术' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'http://cdn.bootcss.com/highlight.js/8.0/styles/monokai_sublime.min.css'}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'ant-design-vue/dist/antd.css',
    'assets/common.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/antd-ui',
    // '@/plugins/editor.client.js',
    '@/plugins/axios.js',
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '@/plugins/editor.client.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // baseURL: "http://49.234.206.77:9997"
    baseURL: process.env.NODE_ENV == "development" ? "http://127.0.0.1:5000" : "http://atl-api.atlansic.com"
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  server: {
    port: process.env.NODE_ENV == "development" ? "3001" : "9999",
    host: '0.0.0.0' // default: localhost,
  }
}
