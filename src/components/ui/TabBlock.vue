<template>
  <div :id="tabId" class="tab-block">
    <ul class="tab-block__nav">
      <li
        v-for="(item, idx) in items"
        :key="item.name"
        class="tab-block__nav-item"
      >
        <a
          :id="`${item.name}-tab`"
          class="tab-block__nav-link"
          :class="selected[idx] ? 'show active' : ''"
          :href="`#${item.name}`"
          @click.prevent="handleTabClick(idx, item.name)"
        >
          {{
            $t(`common.${item.name}`) ? $t(`common.${item.name}`) : item.name
          }}
        </a>
      </li>
    </ul>
    <div
      v-if="isAuthorized"
      :id="`${tabId}TabsContent`"
      class="tab-block__content"
    >
      <div
        v-for="(item, idx) in items"
        v-show="selected[idx]"
        :id="`${item.name}-pane`"
        :key="idx"
        class="tab-block__pane"
      >
        <component
          :is="item.component"
          v-if="item.component"
          :list-class="item.listClass"
          :table-class="item.tableClass"
          :headers="item.headers ? item.headers : null"
          :list="item.list"
          :search="item.search"
        ></component>
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-else-if="item.content"
          class="tab-block__pane-content"
          v-html="item.content"
        ></div>
        <div v-else class="tab-block__pane-content">
          <div class="icon smile" style="text-align: center; padding-top: 60px">
            <img src="/public/img/Smile.svg" style="width: 100px" alt="" />
          </div>
          <br />
          <p
            class="txt"
            style="
              width: 56px;
              margin: 0 auto;
              font-size: 14px;
              font-weight: 600;
              color: #d8dbde;
            "
          >
            {{ $t("common.nodata") }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="!isAuthorized || !items || items.length === 0"
      class="not-information"
    >
      <div class="icon smile">
        <img src="/public/img/Smile.svg" alt="" />
      </div>
      <div class="txt">{{ $t("common.nodata") }}</div>
    </div>
  </div>
</template>

<script>
import BaseList from "~/components/ui/BaseList.vue";
import { mapGetters } from "vuex";

export default {
  name: "TabBlock",
  components: {
    BaseList,
  },
  props: {
    tabId: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ["tab-chosen"],
  data() {
    return {
      selected: this.items.map((item) => item.selected),
    };
  },
  computed: {
    ...mapGetters({ isAuthorized: "core/isAuthorized" }),

    tabItems() {
      return this.items;
    },
  },
  methods: {
    handleTabClick(idx, tabName) {
      this.selected = this.selected.map(
        (val, i) => (this.selected[i] = idx === i)
      );
      this.$emit("tab-chosen", tabName);
    },
  },
};
</script>
