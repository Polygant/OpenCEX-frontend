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
