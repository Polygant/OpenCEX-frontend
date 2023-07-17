//###########################################################################
//   OpenCEX Frontend configuration file. More info
//   https://polygant.notion.site/Settings-3f9e0aae880e433a9d23e76f62a4a456
//###########################################################################

const localConfig = {
  wss_url: "wss://",
  two_fa: "${PROJECT_NAME}",
  project_title: "${PROJECT_NAME}",
  api: {
    baseURL: "https://${DOMAIN}/api/v1/",
    basePublicURL: "https://${DOMAIN}/api/public/v1/",
    host: "${DOMAIN}",
  },
  api_url: "https://${DOMAIN}",
  api_url_plane: "${DOMAIN}",
  recaptcha_site_key: "${RECAPTCHA}",
  vue_v: "prod",
  site_domain: "${DOMAIN}",
  host: "${DOMAIN}",
  help_widget: "${HELP_WIDGET}",
  logo: "${LOGO}",
  themes: [
    {
      main_color: "#2A2259",
      second_color: "#ffac2a",
      cancel_color: "#d93d47",
      login_background: "#36373c",
      login_text: "white",
      main_background: "#edf1fa",
      main_text: "#2a2259",
      input_color: "white",
      input_text: "#2a2259",
      block_color: "white",
      border_color: "#f0f0f0",
    },
    {
      main_color: "#2A2259",
      second_color: "#ffac2a",
      cancel_color: "#d93d47",
      login_background: "#36373c",
      login_text: "white",
      main_background: "#171717",
      main_text: "#888888",
      input_color: "#242424",
      input_text: "#888888",
      block_color: "#242424",
      border_color: "#353535",
    },
  ],
  socials: {
    telegram: {
      link: "${TELEGRAM}",
      title: "sitechange",
    },
    telegramNews: {
      link: "${TG_NEWS}",
      title: "site_news",
    },
    mail: "${SUPPORT_EMAIL}",
    facebook: {
      link: "${FACEBOOK}",
      title: "Exchange",
    },
    twitter: {
      link: "${TWITTER}",
      title: "@",
    },
  },
};

export default localConfig;
