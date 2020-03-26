import React from 'react'
import { assign, Machine } from 'xstate'
import { useMachine } from '@xstate/react'
import CountrySelector from '../components/CountrySelector'
import Stat from '../components/Stat'

const statsApi = 'https://coronavirus-19-api.herokuapp.com/countries'

const covidMachine = Machine(
  {
    id: 'covidMachine',
    initial: 'fetchingStats',
    context: {
      countrySelected: null,
      stats: null,
    },
    states: {
      fetchingStats: {
        invoke: {
          src: 'fetchCovidStats',
          onDone: { target: 'ready', actions: 'assignStats' },
          onError: 'error',
        },
      },
      ready: {
        on: {
          COUNTRY_SELECTED: { actions: 'updateSelectedCountry' },
          FETCH_STATS: 'fetchingStats',
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
        countrySelected: ctx.stats.find(
          stat => stat.country === e.country.target.value,
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
  const [current, send] = useMachine(covidMachine)
  return (
    <div>
      <h3>Covid 19 information</h3>
      {current.matches('fetchingStats') && <div>loading...</div>}
      {current.matches('error') && <div>fetching stats error</div>}
      {current.matches('ready') && (
        <CountrySelector
          handleChange={country => send('COUNTRY_SELECTED', { country })}
          stats={current.context.stats}
        />
      )}
      {current.context.countrySelected && (
        <Stat stat={current.context.countrySelected} />
      )}
    </div>
  )
}

export default HomePage
