<template>
  <div>
    <div
      class="overflow-auto w-full base-table"
      :class="{ 'base-table_shrinked-view': showShrinkedView }"
    >
      <table class="base-table__table">
        <thead>
          <tr class="base-table__table-header" :class="theadTrClass">
            <!-- eslint-disable vue/no-v-html -->
            <th
              v-for="(field, j) in fields"
              :key="j"
              class="base-table__table-heading"
              :class="field.class"
              v-html="field.label"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
            class="base-table__table-row"
            :class="[
              {
                'base-table__table-row_no-border':
                  i === items.length - 1 && !showPagination,
              },
              typeof tbodyTrClass === 'function'
                ? tbodyTrClass(item)
                : tbodyTrClass,
            ]"
          >
            <td
              v-for="(field, j) in fields"
              :key="j"
              class="base-table__table-cell"
              :class="[
                typeof field.tdClass === 'function'
                  ? field.tdClass(item[field.key], field.key, item)
                  : field.tdClass,
                field.class,
              ]"
            >
              <!-- eslint-disable vue/no-v-html -->
              <span
                v-if="field.showLabelInShrinkedView !== false"
                class="base-table__table-cell-shrinked-label"
                v-html="field.label"
              ></span>
              <span>
                <slot
                  :name="`cell(${field.key})`"
                  v-bind="{
                    item,
                    field,
                    value: applyFormatter(
                      { value: item[field.key], key: field.key, item: item },
                      field.formatter
                    ),
                  }"
                >
                  {{
                    applyFormatter(
                      { value: item[field.key], key: field.key, item: item },
                      field.formatter
                    )
                  }}
                </slot>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!isLoading && items.length == 0" class="text-center mt-4 mb-4">
        {{ $t("common.nodata") }}
      </div>
    </div>
    <paginate
      v-if="showPagination"
      :page-range="5"
      :margin-pages="0"
      :page-count="pageCount"
      :prev-text="'❮'"
      :next-text="'❯'"
      class="base-table__pagination"
      :container-class="'pagination pagination-custom'"
      :page-class="'page-item page-item-custom noselect'"
      :prev-class="'page-item page-item-custom-prev noselect'"
      :next-class="'page-item page-item-custom-prev noselect'"
      :break-view-class="'page-item page-item-custom-break'"
      :break-view-text="''"
      :model-value="page"
      @update:model-value="onPageUpdate"
    >
    </paginate>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";

export default {
  components: { Paginate },

  props: {
    itemsProvider: {
      type: Function,
      required: true,
    },

    pageCount: {
      type: Number,
      required: true,
    },

    tbodyTrClass: {
      type: [String, Array, Function],
      default: "",
    },

    theadTrClass: {
      type: [String, Array],
      default: "",
    },

    fields: {
      type: Array,
      required: true,
      validator: (fields) =>
        fields.every((field) => {
          return (
            ["string"].includes(typeof field.key) &&
            ["string"].includes(typeof field.label) &&
            (!field.class || ["string"].includes(typeof field.class)) &&
            (!field.tdClass ||
              ["string", "function"].includes(typeof field.tdClass)) &&
            // (!field.thClass || ['string', 'function'].includes(typeof field.thClass)) &&
            (!field.formatter ||
              ["function"].includes(typeof field.formatter)) &&
            (!field.showLabelInShrinkedView ||
              ["boolean"].includes(typeof field.showLabelInShrinkedView))
          );
        }),
    },

    isShrinkedView: {
      type: Function,
      default: (screenWidth) => screenWidth < 768,
    },
  },

  data() {
    return {
      items: [],
      page: 1,
      showShrinkedView: false,
      isLoading: false,
    };
  },

  computed: {
    showPagination() {
      return this.pageCount > 1;
    },
  },

  mounted() {
    this.startUpdatingShrinkedView();
    this.pullItems();
  },

  beforeUnmount() {
    this.endUpdatingShrinkedView();
  },

  methods: {
    async refresh() {
      await this.pullItems();
    },

    setPage(page) {
      this.page = page;
    },

    async pullItems() {
      const ctx = {
        currentPage: this.page,
      };
      this.isLoading = true;
      this.items = await this.itemsProvider(ctx /*callback*/);
      this.isLoading = false;
    },

    onPageUpdate(page) {
      this.page = page;
      this.pullItems();
    },

    styleColor(field, value) {
      if (field === "current_percent" && value) {
        return value > 0
          ? "launchpad-my__text_green"
          : "launchpad-my__text_red";
      }
    },

    applyFormatter({ value, key, item }, formatter) {
      return typeof formatter === "function"
        ? formatter(value, key, item)
        : value;
    },

    updateIsShrinkedView() {
      this.showShrinkedView = this.isShrinkedView(window.innerWidth);
    },

    startUpdatingShrinkedView() {
      this.updateIsShrinkedView();
      window.addEventListener("resize", this.updateIsShrinkedView);
    },

    endUpdatingShrinkedView() {
      window.removeEventListener("resize", this.updateIsShrinkedView);
    },
  },
};
</script>

<style lang="scss">
$black: #222222;
$green: #49be90;
$red: #f63e30;
$grey: #fafafb;

.base-table {
  &__table {
    color: #222;
    width: inherit;
    font-style: normal;
    font-weight: normal;
  }

  &__table-heading {
    letter-spacing: 0.03em;
    font-weight: normal;
    font-size: 16px;
    text-align: left;
  }

  &__table-heading,
  &__table-cell {
    line-height: 125%;
    color: #2b395b;
    padding: 5px 10px 13px;
  }

  &__table-cell {
    font-size: 14px;
    letter-spacing: 0.05em;
    padding-top: 13px;
    padding-bottom: 12px;
  }

  &__table-cell-shrinked-label {
    display: none;
  }

  &__table-row,
  &__table-header {
    border-bottom: 1px solid #d9d6d6;
  }

  &__table-row_no-border {
    border-bottom: none;
  }

  &__pagination {
    margin-top: 20px;
  }

  &_shrinked-view {
    .base-table {
      &__table-row {
        display: flex;
        flex-direction: column;
      }

      &__table-cell {
        display: flex;
        padding: 9px 0 11px;
      }

      &__table-cell-shrinked-label {
        display: inline-block;
        min-width: 40%;
        max-width: 40%;
        padding-right: 10px;
        font-weight: 400;
        color: black;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: start;
      }

      &__table-header {
        display: none;
      }
    }
  }
}
.base-table__table-header.launchpad-my__row th {
  text-align: left;
}
.bt-s .base-table__table-heading {
  text-align: center;
}
</style>
