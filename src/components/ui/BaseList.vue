<template>
  <div class="table-list m-0 tab-pane__search--wrapper" :class="listClass">
    <div class="search-input-absolute">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="20"
        height="20"
        viewBox="0 0 256 256"
        xml:space="preserve"
        class="search-input-icon"
      >
        <defs></defs>
        <g
          transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
        >
          <path
            d="M 87.803 77.194 L 68.212 57.602 c 9.5 -14.422 7.912 -34.054 -4.766 -46.732 c 0 0 -0.001 0 -0.001 0 c -14.495 -14.493 -38.08 -14.494 -52.574 0 c -14.494 14.495 -14.494 38.079 0 52.575 c 7.248 7.247 16.767 10.87 26.287 10.87 c 7.134 0 14.267 -2.035 20.445 -6.104 l 19.591 19.591 C 78.659 89.267 80.579 90 82.498 90 s 3.84 -0.733 5.305 -2.197 C 90.732 84.873 90.732 80.124 87.803 77.194 z M 21.48 52.837 c -8.645 -8.646 -8.645 -22.713 0 -31.358 c 4.323 -4.322 10 -6.483 15.679 -6.483 c 5.678 0 11.356 2.161 15.678 6.483 c 8.644 8.644 8.645 22.707 0.005 31.352 c -0.002 0.002 -0.004 0.003 -0.005 0.005 c -0.002 0.002 -0.003 0.003 -0.004 0.005 C 44.184 61.481 30.123 61.48 21.48 52.837 z"
            transform=" matrix(1 0 0 1 0 0) "
            stroke-linecap="round"
          />
        </g>
      </svg>
      <input
        v-if="search"
        v-model="searchParameter"
        v-pattern="/^[a-zA-Z\s]{0,24}$/"
        type="text"
        class="tab-pane__search"
      />
    </div>
    <perfect-scrollbar>
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
            <td
              v-for="column in colsList"
              :key="column"
              :class="`${column}-td`"
            >
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
    </perfect-scrollbar>
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
.search-input-absolute {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.search-input-icon {
  position: absolute;
  z-index: 2;
  top: 50px;
  left: 7px;
}
.ps {
  height: 250px;
}
</style>
