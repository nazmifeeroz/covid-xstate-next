import React from 'react'
import { assign, Machine } from 'xstate'
import { useMachine } from '@xstate/react'
import CountrySelector from '../components/CountrySelector'
import Stat from '../components/Stat'
import CountrySearch from '../components/CountrySearch'
import GlobalStyles from '../components/GlobalStyles'

const statsApi = 'https://coronavirus-19-api.herokuapp.com/countries'

const statsMachine = Machine(
  {
    id: 'statsMachine',
    initial: 'fetchStats',
    context: {
      countriesSelected: [],
      stats: null,
    },
    states: {
      fetchStats: {
        invoke: {
          src: 'fetchCovidStats',
          onDone: { target: 'ready', actions: 'assignStats' },
          onError: 'error',
        },
      },
      ready: {
        on: {
          COUNTRY_SELECTED: { actions: 'updateSelectedCountry' },
          FETCH_STATS: 'fetchStats',
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
          [],
        ),
      })),
    },
    services: {
      fetchCovidStats: () =>
        new Promise(async (res, rej) => {
          try {
            const data = await fetch(statsApi).then(resp => resp.json())
            return res(data)
          } catch (error) {
            console.log('error in fetching stats: ', error)
            return rej()
          }
        }),
    },
  },
)

const HomePage = () => {
  const [current, send] = useMachine(statsMachine)
  return (
    <div>
      <GlobalStyles />
      <h3>Covid 19 information</h3>
      {current.matches('fetchStats') && <div>loading...</div>}
      {current.matches('error') && <div>fetching stats error</div>}
      {current.matches('ready') && (
        <>
          <CountrySelector
            handleChange={country => send('COUNTRY_SELECTED', { country })}
            stats={current.context.stats}
          />
          <CountrySearch
            handleChange={country => send('COUNTRY_SELECTED', { country })}
          />
        </>
      )}
      {current.context.countriesSelected.length > 0 && (
        <Stat stats={current.context.countriesSelected} />
      )}
    </div>
  )
}

export default HomePage
