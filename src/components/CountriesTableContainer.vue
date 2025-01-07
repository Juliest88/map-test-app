<template>
  <n-config-provider>
    <n-layout class="countries-table-container" :native-scrollbar="false">
      <n-layout-content content-style="padding: 24px;">
        <div class="heading">
          <h2>Countries</h2>
          <n-pagination
            v-model:page="currentPage"
            :page-size="pageSize"
            :item-count="filteredCountries.length || 0"
            simple
            style="margin-bottom: 16px"
          />
        </div>
        <div v-if="isLoading" class="loading-container">
          <n-spin />
        </div>
        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
        </div>
        <div v-else>
          <n-data-table
            :columns="columns"
            :data="paginatedData"
            row-class-name="countries-table-row"
            :row-props="rowProps"
          />
        </div>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<script>
import { formatNumber } from '@/utils'
import { NPagination, NTag } from 'naive-ui'
import { defineComponent, h } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import IconLocation from './icons/IconLocation.vue'
import IconStar from './icons/IconStar.vue'
import IconMoreHrizontal from './icons/IconMoreHrizontal.vue'
import IconVisibility from './icons/IconVisibility.vue'

export default defineComponent({
  components: {
    IconStar,
    IconLocation,
    IconMoreHrizontal,
    IconVisibility,
    NTag,
    NPagination,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 14,
      columns: [
        {
          title: 'Common name',
          key: 'name',
          minWidth: 230,
          maxWidth: 230,
          render(row) {
            return h('div', { class: 'common-name-td-wrapper' }, [
              h(IconStar),
              h('img', {
                src: row.flags.png,
                alt: row.flags.alt || 'Country flag',
                class: 'rounded-flag',
              }),
              h('span', row.name.common),
            ])
          },
        },
        {
          title: 'Official Name',
          key: 'officialName',
          minWidth: 230,
          maxWidth: 230,
          render(row) {
            return row.name.official
          },
        },
        {
          title: 'Capital',
          key: 'capital',
          minWidth: 230,
          maxWidth: 230,
          render(row) {
            return row.capital
          },
        },
        {
          title: 'Region',
          key: 'region',
          minWidth: 230,
          maxWidth: 230,
          render(row) {
            return h('div', { class: 'region-wrapper' }, [h(IconLocation), h('span', row.region)])
          },
        },
        {
          title: 'Population',
          key: 'population',
          minWidth: 120,
          maxWidth: 120,
          render(row) {
            return h(
              NTag,
              {
                class: 'population-tag',
                size: 'small',
                bordered: true,
                style: 'border-radius: 4px;',
                color: {
                  color: '#ffff',
                  borderColor: '#2E5BFF',
                },
              },
              () => h('span', formatNumber(row.population)),
            )
          },
        },
        {
          title: 'Official languages',
          key: 'officialLanguages',
          minWidth: 230,
          maxWidth: 230,
          render(row) {
            return Object.values(row.languages).join(', ')
          },
        },
        {
          title: 'Time Zone',
          key: 'timezones',
          minWidth: 230,
          maxWidth: 230,
          render(row) {
            return row.timezones && row.timezones.length ? row.timezones.join(', ') : '-'
          },
        },
        {
          title: '',
          key: 'viewMap',
          minWidth: 100,
          maxWidth: 100,
          render: (row) => {
            return h(
              'div',
              {
                class: 'view-map',
                onMouseenter: () => (row.hover = true),
                onMouseleave: () => (row.hover = false),
              },
              [
                h(IconMoreHrizontal, { style: row.hover ? 'display: none;' : 'display: block;' }),
                h(IconVisibility, { style: row.hover ? 'display: block;' : 'display: none;' }),
              ],
            )
          },
        },
      ],
    }
  },
  emits: ['onSelectedCountry'],
  mounted() {
    this.fetchCountriesFromAPI()
  },
  computed: {
    ...mapGetters(['filteredCountries', 'isLoading', 'error']),
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      return this.filteredCountries.slice(startIndex, endIndex)
    },
  },
  methods: {
    ...mapActions(['fetchCountriesFromAPI']),
    rowProps(row) {
      return {
        onClick: () => {
          this.$emit('onSelectedCountry', row)
        },
      }
    },
  },
  watch: {
    filteredCountries(newValue) {
      if ((this.currentPage - 1) * this.pageSize >= newValue.length) {
        this.currentPage = 1
      }
    },
  },
})
</script>

<style>
.countries-table-container {
  border-radius: 6px;
  height: 815px;
  font-size: 12px;

  .heading {
    display: flex;
    margin-bottom: 40px;

    h2 {
      margin-right: auto;
    }
  }

  .countries-table-row {
    &:hover {
      cursor: pointer;
    }
  }

  .region-wrapper {
    display: flex;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
  .common-name-td-wrapper {
    display: flex;

    & > *:not(:last-child) {
      margin-right: 8px;
    }

    img.rounded-flag {
      width: 22px;
      height: 22px;
      max-width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .population-tag {
    span {
      color: #2e5bff;
      font-size: 12px;
      font-weight: 500;
    }
  }

  .view-map {
    height: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #d1d5db;
      border-radius: 50%;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    font-size: 16px;
    height: 100%;
  }
}
</style>
