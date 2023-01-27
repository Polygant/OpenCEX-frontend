<template>
  <div id="idensic"></div>
</template>

<script>
export default {
  name: "KycFrame",
  props: {
    isWizard: {
      type: Boolean,
    },
  },
  data() {
    return {
      kyctoken: "",
      kycuser: "",
    };
  },
  methods: {
    renderKYC(aToken, user) {
      if (!document.querySelector("#idensic")) return;

      /* eslint-disable */
      const id = idensic.init(
          "#idensic",
          {
            clientId: "OpenCEX",
            externalUserId: user,
            accessToken: aToken,
            navConf: {
              skipWelcomeScreen: false,
              skipAgreementsScreen: false,
              skipReviewScreen: false,
              registration: "disabled"
            },
            uiConf: {
              customCss: "",
              lang: localStorage.getItem("planguage") || "en",
              steps: {
                IDENTITY: {
                  subTitle: ""
                },
                IDENTITY2: {
                  subTitle: ""
                },
                SELFIE: {
                  subTitle: ""
                },
                SELFIE2: {
                  subTitle: "",
                  videoRequired: "enabled"
                },
                PROOF_OF_RESIDENCE: {
                  subTitle: ""
                },
                INVESTABILITY: {
                  subTitle: ""
                },
                ACCREDITED_INVESTOR: {
                  subTitle: ""
                },
                COMPANY: {
                  subTitle: ""
                },
                E_SIGN: {
                  subTitle: ""
                }
              }
            }
          },
          function(messageType, payload) {
          }
      );
    }
  },
  mounted() {
    this.$http
        .post(
            "kyc_get_access_token/?source=wizard"
        )
        .then(
            response => {
              this.kyctoken = response.data["token"];
              this.kycuser = response.data["userId"];
              this.renderKYC(response.data["token"], response.data["userId"]);
            }
        );
  }
};
</script>
