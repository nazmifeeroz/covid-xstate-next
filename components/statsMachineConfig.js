import { assign, Machine } from "xstate"

const statsApi = "https://coronavirus-19-api.herokuapp.com/countries"

const statsMachine = Machine(
  {
    id: "statsMachine",
    initial: "fetchStats",
    context: {
      countriesSelected: [],
      stats: null,
    },
    states: {
      fetchStats: {
        invoke: {
          src: "fetchCovidStats",
          onDone: { target: "ready", actions: "assignStats" },
          onError: "error",
        },
      },
      ready: {
        on: {
          COUNTRY_SELECTED: { actions: "updateSelectedCountry" },
        },
      },
      error: {},
    },
  },
  {
    actions: {
      assignStats: assign((_ctx, e) => ({
        stats: e.data,
      })),
      updateSelectedCountry: assign((ctx, e) => ({
        countriesSelected: ctx.stats.reduce(
          (acc, stat) =>
            stat.country
              .toLowerCase()
              .match(e.country.target.value.toLowerCase())
              ? [...acc, stat]
              : acc,
          []
        ),
      })),
    },
    services: {
      fetchCovidStats: () =>
        new Promise(async (res, rej) => {
          try {
            const data = await fetch(statsApi).then((resp) => resp.json())
            return res(data)
          } catch (error) {
            console.log("error in fetching stats: ", error)
            return rej()
          }
        }),
    },
  }
)

export default statsMachine
