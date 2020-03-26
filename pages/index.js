import React from 'react'
import { assign, Machine } from 'xstate'
import { useMachine } from '@xstate/react'
import CountrySelector from '../components/CountrySelector'
import Stat from '../components/Stat'
import CountrySearch from '../components/CountrySearch'

const statsApi = 'https://coronavirus-19-api.herokuapp.com/countries'

const covidMachine = Machine(
  {
    id: 'covidMachine',
    initial: 'fetchingStats',
    context: {
      countriesSelected: [],
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
  const [current, send] = useMachine(covidMachine)
  return (
    <div>
      <h3>Covid 19 information</h3>
      {current.matches('fetchingStats') && <div>loading...</div>}
      {current.matches('error') && <div>fetching stats error</div>}
      {current.matches('ready') && (
        <>
          <CountrySearch
            handleChange={country => send('COUNTRY_SELECTED', { country })}
          />
          <CountrySelector
            handleChange={country => send('COUNTRY_SELECTED', { country })}
            stats={current.context.stats}
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
