<template>
  <div class="page-header">
    <div class="language">
      <LanguageSelector class="language__block" />
    </div>
    <MainLogo />
  </div>
</template>
<script>
import LanguageSelector from "~/components/layout/parts/LanguageSelector.vue";
import MainLogo from "~/components/layout/parts/MainLogo.vue";

export default {
  name: "ModalPagesHeader",
  components: { MainLogo, LanguageSelector },
};
</script>
<style lang="scss">
@import "~/assets/css/variables";

.page-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.language {
  width: 304px;
  margin: 20px 0 10px 0;
  position: relative;

  &__block {
    float: right;
  }
}

button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.logIn {
  color: #fff;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #36373c;
  display: flex;
  flex-direction: column;

  &__descr {
    font-size: 16px;
    font-weight: 400;
    text-align: center;
  }

  &__title {
    text-align: center;
    max-width: 304px;
    font-size: 35px;
    font-weight: 300;
    position: relative;
  }

  &__popup {
    padding: 14px;
    padding-left: 18px;
    padding-right: 46px;
    margin-top: 16px;
    background-color: var(--theme-primary-color);
    color: #fff;
    font-family: "OpenSans", Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    max-width: 100%;
    border-radius: 3px;

    &::after {
      content: "";
      position: absolute;
      background: url("/public/img/ok.png");
      width: 16px;
      height: 11px;
      margin-left: 125px;
      margin-top: -6px;
    }

    &_white-checkmark {
      position: relative;

      &::after {
        margin: 0;
        top: calc(50% - 5px);
        right: 30px;
        background: transparent;
        border-bottom: 2px solid white;
        transform: rotate(45deg);
        width: 9px;
      }
      &::before {
        content: "";
        width: 18px;
        position: absolute;
        top: calc(50% - 5px);
        right: 30px;
        border-bottom: 2px solid white;
        transform: rotate(-45deg) translate(3.5px, 11px);
      }
    }
  }

  &__form {
    margin-top: 37px;
    display: flex;
    flex-direction: column;
  }

  &__recovery {
    text-align: center;
    font-weight: 700;
    margin-bottom: 10px;
    font-size: 14px;

    &,
    &:hover {
      color: white;
    }
  }

  &__or {
    font-weight: 400;
    margin-bottom: 12px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 20px;
      height: 1px;
      margin-left: -30px;
      margin-top: -1px;
      background-color: #ffffff;
      top: 50%;
    }

    &::after {
      content: "";
      position: absolute;
      width: 20px;
      height: 1px;
      margin-left: 10px;
      margin-top: -1px;
      background-color: #ffffff;
      top: 50%;
    }
  }

  &__register {
    min-height: 54px;
    background-color: #4e5557;
    width: 304px;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    color: white;

    &:hover {
      opacity: 0.8;
    }
  }

  &__formInput {
    height: 35px;
  }
}

.logIn__form__input {
  margin-bottom: 13px;
  width: 304px;
  border-radius: 3px !important;
  min-height: 45px;
  font-size: 14px !important;
  font-weight: 400 !important;
}

.logIn__form__input::-webkit-input-placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input::-moz-placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input:-ms-input-placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input::placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input_button {
  min-height: 54px;
  background-color: var(--theme-primary-color) !important;
  border: none;
  font-weight: 700 !important;
  color: white !important;
}

.logIn__form__input_button:hover,
.logIn__form__input_button:active,
.logIn__form__input_button:visited {
  background-color: rgba(60, 191, 140, 0.7);
}

/* style of input */
input::-moz-placeholder {
  color: #222;
  font-weight: 700;
}

input::-webkit-input-placeholder {
  color: #222;
  font-weight: 700;
}

input:-ms-input-placeholder {
  opacity: 1;
}

input::placeholder {
  opacity: 1;
}

input[type="email"]:focus,
input[type="number"]:focus,
input[type="password"]:focus,
input[type="tel"]:focus,
input[type="url"]:focus,
input[type="text"]:focus,
input[type="number"]:focus,
input[type="button"]:focus {
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}

input[type="email"],
input[type="number"],
input[type="password"],
input[type="tel"],
input[type="url"],
input[type="text"],
textarea {
  background: #fff;
  font-size: 16px;
  width: 100%;
  height: 100%;
  padding: 7px 12px;
  outline: none;
  box-shadow: none;
  border: solid 1px #e0e0e0;
  color: #222222;
  border-radius: 5px;
  font-weight: 700;
}

input[type="text"] {
  height: inherit;
}

button {
  border: none;
  background-color: transparent;
  outline: none;
}

.auth {
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #e7f4fd inset;
  }
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #e7f4fd inset;
  }
  input:-webkit-autofill:hover {
    -webkit-box-shadow: 0 0 0px 1000px #e7f4fd inset;
  }
}

.opacitychangebtn:active {
  opacity: 0.8 !important;
}

.register {
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #36373c;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 14px;

  &__input--birthday-invalid {
    .mx-input {
      color: #e93a3a;
    }
  }

  .mx-input-wrapper,
  .mx-input-wrapper .mx-input {
    height: 100%;
    min-height: 45px;
  }

  .mx-input {
    background-color: white;
  }

  .mx-input-append {
    width: 65px;
    padding: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    overflow: hidden;
  }

  .mx-datepicker {
    width: 100%;
  }

  &__birthday-error {
    position: absolute;
    color: #f94640;
    bottom: -10px;
  }

  &__password-icon {
    position: absolute;
    right: 15px;
    top: 10px;
    color: #bfc4d1;
    cursor: pointer;

    &--green {
      color: var(--theme-primary-color);
    }
  }

  &__user-exist-hint {
    color: #f94640;
  }

  &__have-account {
    text-align: center;
  }

  &__link {
    color: var(--theme-primary-color);

    &:hover {
      color: rgba(60, 191, 140, 0.7);
    }

    &--hint {
      font-size: 1.1em;
    }
  }

  &__input-group {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 10px;
    margin-bottom: 10px;

    &--country {
      margin-bottom: 20px;
    }

    &--half-width {
      width: 50%;

      @media (max-width: 530px) {
        width: 100%;
      }
    }

    &--select {
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 15px;
      }
    }
  }

  &__input-wrapper {
    position: relative;

    &--recap {
      width: fit-content;
      margin: 0 auto;
    }
  }

  &__input-error-hint {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #f94640;
    background-color: white;
    box-shadow: 0 0 4px 5px white;
    padding: 3px;

    &--password {
      right: 40px;
      top: 35%;
    }

    &--recap {
      right: 45px;
      top: 47%;
    }

    &--country {
      right: 45px;
      @media (min-width: 531px) {
        top: 48%;
      }
    }

    &--birthday {
      top: 60%;
      right: 85px;
      @media (min-width: 531px) {
        top: 55%;
      }
    }
  }

  &__title {
    text-align: center;
    max-width: 304px;
    font-size: 35px;
    font-weight: 300;
    margin-bottom: 25px;
  }

  &__form {
    display: flex;
    flex-wrap: wrap;
    max-width: 565px;
  }

  &__popup {
    position: relative;
    padding: 14px;
    padding-left: 18px;
    padding-right: 46px;
    margin-top: 16px;
    background-color: #43c868;
    color: white;
    font-family: "Montserrat", Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    max-width: 100%;
    border-radius: 3px;

    &::after {
      content: "";
      position: absolute;
      background: url("/public/img/checked.png") no-repeat;
      width: 16px;
      height: 11px;
      top: 40%;
      right: 22px;
    }
  }

  &__input {
    width: 100%;
    border-radius: 3px;
    min-height: 45px;
    font-size: 1em;
    font-weight: 600;
    padding: 10px;

    &--birthday {
      margin-bottom: 13px;
      width: 100%;
      border-radius: 3px;
      min-height: 45px;
    }

    &--password {
      padding-right: 45px;
    }
  }

  &__button {
    width: 100%;
    min-height: 70px;
    background-color: var(--theme-primary-color);
    border: none;
    margin: 15px auto;
    font-size: 1.5em;
    cursor: pointer;
    color: white;
    border-radius: 5px;
    transition: background-color 0.15s ease-in;

    &:hover,
    &:active {
      background-color: darken($theme-primary-color, 5%);
      transition: background-color 0.15s ease-out;
    }

    &:disabled {
      background-color: #323f5e;
      color: #545f7d;
      pointer-events: none;
    }

    @media (max-width: 530px) {
      min-height: 55px;
    }
  }
}

.btn-def {
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  padding: 10px 20px;
  font-weight: 700;
  text-align: center;
  color: #fff;
  border: none;
  text-transform: uppercase;

  .green {
    background: var(--theme-primary-color);
  }

  .yellow {
    background: #ffbb38;
  }
}

.secretclass1 {
  text-align: center;
  width: 90%;
  max-width: 491px;
  box-shadow: 0px 0px 20px 1px #0d121f inset;
  color: #169664;
  font-weight: 600;
  font-size: 33px;
  background-color: #212c46;
  border-radius: 6px;
  border: 2px solid #d4d4d4;
}

.secretclass1::placeholder {
  color: var(--theme-primary-color);
  opacity: 0.03;
}
.alert-warning span a {
  color: var(--theme-primary-color);
}
.mx-calendar-content .mx-panel .cell.actived {
  background-color: var(--theme-primary-color);
}
.register__input-group
  .custom-control-input:checked
  ~ .custom-control-label::before {
  border-color: var(--theme-primary-color);
  background-color: var(--theme-primary-color);
}
.input-group-append {
  margin-left: -2px;
}
</style>
