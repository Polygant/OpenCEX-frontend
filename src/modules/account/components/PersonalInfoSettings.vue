<template>
  <div class="personal-info-settings" :class="{ blured: blured }">
    <div class="settings__NAME">
      {{ $t("common.personalInfo") }}
    </div>
    <div class="px-4 pt-5">
      <p class="pb-2 flex">
        <strong class="pt-2 mr-2">{{ $t("common.firstname") }}:</strong>
        <span v-if="firstNameEdit" class="flex">
          <input
            v-model="firstName"
            v-pattern="/^[a-zA-Z\s]*$/"
            class="col-span-2"
            type="text"
          />
          <img
            src="/public/img/check-circle.svg"
            width="20"
            class="cursor-pointer ml-2"
            @click="saveField()"
          />
        </span>
        <span v-else class="p-2">
          {{ profile.user.first_name }}
          <img
            src="/public/img/pencil_b.svg"
            width="20"
            @click="editField('firstName')"
          />
        </span>
      </p>
      <p class="pb-2 flex">
        <strong class="pt-2 mr-2">{{ $t("common.lastname") }}:</strong>
        <span v-if="lastNameEdit" class="flex">
          <input
            v-model="lastName"
            v-pattern="/^[a-zA-Z\s]*$/"
            class="col-span-2"
            type="text"
          />
          <img
            src="/public/img/check-circle.svg"
            width="20"
            class="cursor-pointer ml-2"
            @click="saveField()"
          />
        </span>
        <span v-else class="p-2">
          {{ profile.user.last_name }}
          <img
            src="/public/img/pencil_b.svg"
            width="20"
            @click="editField('lastName')"
          />
        </span>
      </p>
      <p v-if="birthday" class="pb-2 flex">
        <strong class="pt-2 mr-2">{{ $t("common.birthday") }}:</strong>
        <span v-if="birthdayEdit" class="flex">
          <date-picker
            ref="datepicker"
            v-model:value="birthDay"
            :typeable="true"
            :clearable="datePickerOptions.isClearable"
            :editable="datePickerOptions.editable"
            :format="datePickerOptions.format"
            :placeholder="datePickerOptions.placeholder"
            :first-day-of-week="datePickerOptions.firstDay"
            value-type="timestamp"
            :lang="$locale === 'en' ? 'en' : 'ru'"
            class="register__input--birthday"
          >
          </date-picker>
          <img
            src="/public/img/check-circle.svg"
            width="20"
            class="cursor-pointer ml-2"
            style="position: relative; top: -8px"
            @click="saveField()"
          />
        </span>
        <span v-else class="p-2">
          {{ birthdayLive === "" ? birthday : birthdayLive }}
          <img
            src="/public/img/pencil_b.svg"
            width="20"
            @click="editField('birthday')"
          />
        </span>
      </p>
      <p v-if="profile.country && notAfghanistan" class="pb-2 flex">
        <strong class="pt-2 mr-2">{{ $t("common.country") }}:</strong>
        <span class="p-2">
          {{ profile.country.name }}
        </span>
      </p>
      <p class="pb-6">
        <strong class="mr-2">{{ $t("common.email") }}:</strong>
        {{ profile.user.username }}
      </p>
      <p v-if="profile.referrer" class="pb-4">
        <strong class="mr-2">{{ $t("common.referrer") }}:</strong>
        {{ profile.referrer }}
      </p>
      <p v-if="profile.phone" class="pb-2">
        <strong class="mr-2">{{ $t("common.phonenumber") }}:</strong>
        {{ profile.phone }}
      </p>
    </div>
  </div>
</template>
<script>
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
export default {
  name: "PersonalInfoSettings",
  components: { DatePicker },
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    minYearsOld: 18,
    firstName: "",
    lastName: "",
    birthDay: "",
    country: "",
    firstNameEdit: false,
    lastNameEdit: false,
    birthdayEdit: false,
    birthdayLive: "",
    blured: false,
  }),
  computed: {
    birthRangeError() {
      return this.isBirthdayCorrect;
    },
    isBirthdayCorrect() {
      if (this.birthDay) {
        return this.isOlderThen(this.minYearsOld);
      }
      return false;
    },
    datePickerOptions() {
      return {
        isClearable: false,
        format: "DD.MM.YYYY",
        editable: true,
        firstDay: 1,
        placeholder: this.$locale === "ru" ? "ЧЧ.ММ.ГГГГ" : "DD.MM.YYYY",
      };
    },
    notAfghanistan() {
      return this.profile.country.code !== "AF";
    },
    showSave() {
      return this.firstNameEdit || this.lastNameEdit || this.birthdayEdit;
    },
    birthday() {
      if (this.profile.birthday) {
        let d = this.profile.birthday.split(" ")[0].split("-");
        return `${d[2]}.${d[1]}.${d[0]}`;
      } else {
        return null;
      }
    },
    birthdayFormat() {
      try {
        return new Date(this.birthDay).toISOString();
      } catch (e) {
        return null;
      }
    },
  },
  watch: {
    "$i18n.locale": {
      immediate: true,
      handler(val) {
        this.$store.dispatch("core/getCountryList", val);
      },
    },
  },
  mounted() {
    setTimeout(() => {
      this.firstName = this.profile.user.first_name;
      this.lastName = this.profile.user.last_name;
      this.birthDay = this.birthday;
      this.country = this.profile.country?.name;
    }, 1000);
  },
  methods: {
    isOlderThen(years) {
      const birthdayTimestamp = this.birthDay;
      const now = new Date();
      now.setFullYear(now.getFullYear() - years);
      const minBirthdayTimestamp = now.getTime();
      return birthdayTimestamp < minBirthdayTimestamp;
    },
    convertDate(date) {
      let dateFormated = new Date(
        date - new Date(date).getTimezoneOffset() * 60000
      ).toISOString();
      return dateFormated;
    },
    onSelectCountry(value) {
      this.country = value;
    },
    disableEditFields() {
      this.firstNameEdit = false;
      this.lastNameEdit = false;
      this.birthdayEdit = false;
    },
    editField(act) {
      this.disableEditFields();
      if (act === "firstName") {
        this.firstNameEdit = true;
      }
      if (act === "lastName") {
        this.lastNameEdit = true;
      }
      if (act === "birthday") {
        this.birthdayEdit = true;
      }
    },
    saveField() {
      if (this.firstNameEdit) {
        if (this.firstName.length > 0) {
          this.$http
            .patch("/auth/user/", {
              first_name: this.firstName,
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              this.profile.user.first_name = this.firstName;
            });
        } else {
          this.$notify({
            type: "error",
            text: this.$t("common.not_empty_field"),
          });
        }
      }
      if (this.lastNameEdit) {
        if (this.lastName.length > 0) {
          this.$http
            .patch("/auth/user/", {
              last_name: this.lastName,
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              this.profile.user.last_name = this.lastName;
            });
        } else {
          this.$notify({
            type: "error",
            title: ``,
            text: this.$t("common.not_empty_field"),
          });
        }
      }
      if (this.birthdayEdit) {
        if (this.birthRangeError) {
          this.blured = true;
          this.$http
            .put("/profile/", {
              birthday: this.birthdayFormat,
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              this.birthdayLive = this.birthday;
            })
            .finally(() => {
              location.reload();
            });
        } else {
          this.$notify({
            type: "error",
            title: ``,
            text: this.$t("common.bdayError"),
          });
        }
        this.disableEditFields();
      }
      this.disableEditFields();
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

.personal-info-settings strong {
  font-weight: 700;
}
.btn {
  cursor: pointer;
  border: none;
  color: #ffffff;
  border-radius: 5px;
  height: 36px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b87bc;
}
.blured {
  filter: blur(8px);
}
</style>
