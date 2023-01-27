<template>
  <div class="personal-info-settings">
    <p v-if="profile.user.first_name">
      {{ $t("common.firstname") }}: {{ profile.user.first_name }}
    </p>
    <p v-if="profile.user.last_name">
      {{ $t("common.lastname") }}: {{ profile.user.last_name }}
    </p>
    <p v-if="birthday">{{ $t("common.birthday") }}: {{ birthday }}</p>
    <p v-if="profile.country && notAfghanistan">
      {{ $t("common.country") }}: {{ profile.country.name }}
    </p>
    <p>{{ $t("common.email") }}: {{ profile.user.username }}</p>
    <p v-if="profile.referrer">
      {{ $t("common.referrer") }}: {{ profile.referrer }}
    </p>
    <p v-if="profile.phone">
      {{ $t("common.phonenumber") }}: {{ profile.phone }}
    </p>
  </div>
</template>
<script>
export default {
  name: "PersonalInfoSettings",
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    notAfghanistan() {
      return this.profile.country.code !== "AF";
    },
    birthday() {
      if (this.profile.birthday) {
        const tzoffset = new Date().getTimezoneOffset() * 60000;
        return new Date(parseInt(this.profile.birthday, 10) * 1000 - tzoffset)
          .toLocaleDateString()
          .split("T")[0];
      } else {
        return null;
      }
    },
  },
};
</script>
<style scoped>
button {
  border: none;
  background-color: transparent;
  outline: none;
}

input[type="password"]::-webkit-input-placeholder {
  opacity: 0.6;
  font-size: 19px;
}

@media screen and (max-width: 1199px) {
}
</style>
