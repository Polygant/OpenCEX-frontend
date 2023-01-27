import Button from "~/components/ui/Button.vue";
import Card from "~/components/ui/VCard.vue";
import CheckBox from "~/components/ui/form/Checkbox.vue";
import Select from "~/components/ui/form/VSelect.vue";
import Textarea from "~/components/ui/form/TextArea.vue";
import TextField from "~/components/ui/form/TextField.vue";
import Icon from "~/components/ui/VIcon.vue";

import BaseButton from "~/components/shared/BaseButton.vue";
import BaseCopyInput from "~/components/shared/BaseCopyInput.vue";
import BaseTable from "~/components/shared/BaseTable.vue";
import BaseTextField from "~/components/shared/BaseTextField.vue";
import BaseModal from "~/components/shared/BaseModal.vue";
import BaseSelect from "~/components/shared/BaseSelect.vue";

export default (app) => {
  app.component("BaseButton", BaseButton);
  app.component("BaseCopyInput", BaseCopyInput);
  app.component("BaseTable", BaseTable);
  app.component("BaseTextField", BaseTextField);
  app.component("BaseModal", BaseModal);
  app.component("BaseSelect", BaseSelect);
  app.component("CheckBox", CheckBox);
  app.component("TextField", TextField);
  app.component("VTextarea", Textarea);
  app.component("VSelect", Select);
  app.component("VCard", Card);
  app.component("VBtn", Button);
  app.component("VIcon", Icon);
};
