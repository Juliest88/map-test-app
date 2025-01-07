import { createStore } from 'vuex'
import axios from 'axios'
import { API_URL } from '@/config'

const store = createStore({
  state: {
    countries: [],
    searchValue: '',
    isLoading: false,
    error: null,
  },
  mutations: {
    setCountries(state, countries) {
      state.countries = countries
    },
    setSearchValue(state, value) {
      state.searchValue = value
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setError(state, error) {
      state.error = error
    },
  },
  actions: {
    async fetchCountriesFromAPI({ commit }) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const response = await axios.get(API_URL)
        const countries = response.data
          .map((country) => ({
            ...country,
            searchableStrings: generateSearchableStrings(country),
          }))
          .sort((a, b) => a.name.common.localeCompare(b.name.common))

        commit('setCountries', countries)
      } catch (error) {
        console.error('Error fetching countries:', error)
        commit('setError', 'Error fetching countries')
      } finally {
        commit('setLoading', false)
      }
    },
    setSearchValue({ commit }, value) {
      commit('setSearchValue', value)
    },
  },
  getters: {
    filteredCountries(state) {
      if (!state.searchValue) {
        return state.countries
      }
      const searchInput = state.searchValue.toLowerCase()

      return state.countries.filter((country) =>
        country.searchableStrings.some((str) => str.includes(searchInput)),
      )
    },
    isLoading(state) {
      return state.isLoading
    },
    error(state) {
      return state.error
    },
  },
})

function generateSearchableStrings(country) {
  const strings = [
    country.name.common?.toLowerCase(),
    country.name.official?.toLowerCase(),
    country.region?.toLowerCase(),
  ]

  if (country.name.nativeName) {
    Object.values(country.name.nativeName).forEach((native) => {
      strings.push(native.common?.toLowerCase())
      strings.push(native.official?.toLowerCase())
    })
  }

  if (country.capital?.length) {
    strings.push(...country.capital.map((cap) => cap.toLowerCase()))
  }

  return strings.filter(Boolean)
}

export default store
