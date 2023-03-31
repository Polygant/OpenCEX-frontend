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
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
              style="width: 100px"
            >
              <path
                class="smile-st0"
                d="M44.5 43.2C40.6 38.6 36 36 30 36s-10.6 2.6-14.5 7.2c-.5.6-.4 1.5.2 2 .3.2.6.3.9.3.4 0 .8-.2 1.1-.5 3.3-3.9 7.2-6.2 12.3-6.2 5.1 0 9 2.3 12.3 6.2.3.3.7.5 1.1.5.3 0 .7-.1.9-.3.6-.5.7-1.4.2-2z"
              />
              <path
                class="smile-st1"
                d="M30 60C13.4 60 0 46.6 0 30S13.4 0 30 0s30 13.4 30 30-13.4 30-30 30zm0-56C15.6 4 4 15.6 4 30s11.6 26 26 26 26-11.6 26-26S44.4 4 30 4z"
              />
              <path
                class="smile-st1"
                d="M18.5 15c4.1 0 7.5 3.4 7.5 7.5S22.6 30 18.5 30 11 26.6 11 22.5s3.4-7.5 7.5-7.5z"
              />
              <path
                class="smile-st3"
                d="M18.5 18c2.5 0 4.5 2 4.5 4.5S21 27 18.5 27 14 25 14 22.5s2-4.5 4.5-4.5z"
              />
              <path
                class="smile-st1"
                d="M18.5 20c1.4 0 2.5 1.1 2.5 2.5S19.9 25 18.5 25 16 23.9 16 22.5s1.1-2.5 2.5-2.5zm-5.2-4.4l4.2-4.2c.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1l-4.2 4.2c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.6 0-2.1zm28.2-.6c4.1 0 7.5 3.4 7.5 7.5S45.6 30 41.5 30 34 26.6 34 22.5s3.4-7.5 7.5-7.5z"
              />
              <path
                class="smile-st3"
                d="M41.5 18c2.5 0 4.5 2 4.5 4.5S44 27 41.5 27 37 25 37 22.5s2-4.5 4.5-4.5z"
              />
              <path
                class="smile-st1"
                d="M41.5 20c1.4 0 2.5 1.1 2.5 2.5S42.9 25 41.5 25 39 23.9 39 22.5s1.1-2.5 2.5-2.5zm5.2-4.4l-4.2-4.2c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l4.2 4.2c.6.6 1.5.6 2.1 0 .6-.6.6-1.6 0-2.1z"
              />
            </svg>
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
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          style="width: 60px; height: 60px"
        >
          <path
            class="smile-st0"
            d="M44.5 43.2C40.6 38.6 36 36 30 36s-10.6 2.6-14.5 7.2c-.5.6-.4 1.5.2 2 .3.2.6.3.9.3.4 0 .8-.2 1.1-.5 3.3-3.9 7.2-6.2 12.3-6.2 5.1 0 9 2.3 12.3 6.2.3.3.7.5 1.1.5.3 0 .7-.1.9-.3.6-.5.7-1.4.2-2z"
          />
          <path
            class="smile-st1"
            d="M30 60C13.4 60 0 46.6 0 30S13.4 0 30 0s30 13.4 30 30-13.4 30-30 30zm0-56C15.6 4 4 15.6 4 30s11.6 26 26 26 26-11.6 26-26S44.4 4 30 4z"
          />
          <path
            class="smile-st1"
            d="M18.5 15c4.1 0 7.5 3.4 7.5 7.5S22.6 30 18.5 30 11 26.6 11 22.5s3.4-7.5 7.5-7.5z"
          />
          <path
            class="smile-st3"
            d="M18.5 18c2.5 0 4.5 2 4.5 4.5S21 27 18.5 27 14 25 14 22.5s2-4.5 4.5-4.5z"
          />
          <path
            class="smile-st1"
            d="M18.5 20c1.4 0 2.5 1.1 2.5 2.5S19.9 25 18.5 25 16 23.9 16 22.5s1.1-2.5 2.5-2.5zm-5.2-4.4l4.2-4.2c.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1l-4.2 4.2c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.6 0-2.1zm28.2-.6c4.1 0 7.5 3.4 7.5 7.5S45.6 30 41.5 30 34 26.6 34 22.5s3.4-7.5 7.5-7.5z"
          />
          <path
            class="smile-st3"
            d="M41.5 18c2.5 0 4.5 2 4.5 4.5S44 27 41.5 27 37 25 37 22.5s2-4.5 4.5-4.5z"
          />
          <path
            class="smile-st1"
            d="M41.5 20c1.4 0 2.5 1.1 2.5 2.5S42.9 25 41.5 25 39 23.9 39 22.5s1.1-2.5 2.5-2.5zm5.2-4.4l-4.2-4.2c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l4.2 4.2c.6.6 1.5.6 2.1 0 .6-.6.6-1.6 0-2.1z"
          />
        </svg>
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
