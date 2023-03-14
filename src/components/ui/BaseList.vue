<template>
  <div class="table-list m-0 tab-pane__search--wrapper" :class="listClass">
    <input
      v-if="search"
      v-model="searchParameter"
      v-pattern="/^[a-zA-Z\s]{0,24}$/"
      type="text"
      class="tab-pane__search"
    />
    <table class="table-striped table-list__table" :class="tableClass">
      <thead>
        <th v-for="col in colsList" :key="col">
          <div class="table-list__table-th">
            {{ $te(`common.${col}`) ? $t(`common.${col}`) : null }}
          </div>
        </th>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in filteredList" :key="idx" :data-num="idx">
          <td v-for="column in colsList" :key="column" :class="`${column}-td`">
            <div class="table-list__table-td">
              <img
                v-if="isImgField({ [column]: row[column] })"
                :src="row[column]"
              />
              <span v-else-if="row.hasOwnProperty(column)">
                {{ row[column] }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "BaseList",
  props: {
    listClass: {
      type: String,
      default: "",
    },
    tableClass: {
      type: String,
      default: "",
    },
    headers: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      required: true,
    },
    search: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      searchParameter: "",
    };
  },
  computed: {
    colsList() {
      if (this.headers) {
        return this.headers;
      }

      return this.list.reduce((acc, item) => {
        Object.keys(item).forEach((val) => {
          if (!~acc.indexOf(val)) {
            acc.push(val);
          }
        });
        return acc;
      }, []);
    },
    filteredList() {
      return this.search
        ? this.list.filter((item) => {
            return item.currency
              .toUpperCase()
              .includes(this.searchParameter.toUpperCase());
          })
        : this.list;
    },
  },
  methods: {
    isImgField(obj) {
      let isIconName = Object.keys(obj).every((fieldName) =>
        fieldName.match(/(icon)/gi)
      );
      let isImgContent = Object.keys(obj).every((fieldName) =>
        obj[fieldName] !== undefined
          ? obj[fieldName].toString().match(/(svg)|(png)|(jpg)|(gif)/gi)
          : ""
      );
      return isIconName || isImgContent;
    },
  },
};
</script>

<style scoped lang="scss">
.table-list {
  display: block;
  width: 100%;
  overflow-x: auto;
  border-top-right-radius: 3px;
  background-color: #ffffff;
  max-height: 300px;
  margin-top: 15px;
  box-shadow: unset;

  @media (max-width: 1280px) {
    max-height: 385px;
  }

  &__table {
    width: 100%;
    margin: 0;
    border-collapse: collapse;
  }

  &__table-td,
  &__table-th {
    font-size: 12px;
    line-height: 1.25;
    height: 32px;
    display: flex;
    align-items: center;
    min-width: 20px;
    min-height: 20px;
  }

  td,
  th {
    vertical-align: top;
    padding: 5px;
    line-height: 1;
    &:first-child {
      padding-left: 16px;
      padding-right: 10px;
    }
    &:last-child {
      padding-left: 10px;
      padding-right: 16px;
    }
  }

  &.wallet {
    .currency-td {
      font-weight: bold;
    }
    tr,
    thead {
      td:first-child,
      th:first-child {
        max-width: 20px;
      }

      td:nth-of-type(n + 3),
      th:nth-of-type(n + 3) {
        .table-list__table-td,
        .table-list__table-th {
          justify-content: flex-end;
        }
      }
    }
    .table-list__table-td img {
      width: 16px;
      height: 16px;
    }
    .table-list__table-td {
      font-size: 12px;
    }
  }
  .currency-td {
    padding-left: 5px;
    padding-right: 0;
  }

  .tab-pane__search {
    padding-left: 40px;
    border-radius: 0;
    border-bottom: 1px solid rgba(199, 201, 204, 0.5);
    position: absolute;
    top: 41px;
    left: 0;
    background-color: #fff;
  }
}
.tab-pane__search--wrapper {
  padding-top: 36px;
}
</style>
