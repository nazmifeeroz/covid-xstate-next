import React from 'react'
import { assign, Machine } from 'xstate'
import { useMachine } from '@xstate/react'

const sgStatsApi =
  'https://coronavirus-19-api.herokuapp.com/countries/singapore'

const covidMachine = Machine(
  {
    id: 'covidMachine',
    initial: 'fetchAPI',
    context: {
      sgStats: null
    },
    states: {
      fetchAPI: {
        invoke: {
          src: 'fetchCovidStats',
          onDone: { target: 'ready', actions: 'assignSgStats' },
          onError: 'error'
        }
      },
      ready: {},
      error: {}
    }
  },
  {
    actions: {
      assignSgStats: assign((_ctx, e) => ({
        sgStats: e.data
      }))
    },
    services: {
      fetchCovidStats: () =>
        new Promise(async (res, rej) => {
          try {
            const data = await fetch(sgStatsApi).then(resp => resp.json())
            return res(data)
          } catch (error) {
            console.log('error in fetching stats: ', error)
            return rej()
          }
        })
    }
  }
)

const HomePage = () => {
  const [current, send] = useMachine(covidMachine)
  return (
    <div>
      <h3>Covid 19 information</h3>
      {current.matches('fetchAPI') && <div>loading...</div>}
      {current.matches('error') && <div>fetching stats error</div>}
      {current.matches('ready') && (
        <div>
          <b>Singapore</b>
          <br />
          Cases: {current.context.sgStats.cases} | Today:{' '}
          {current.context.sgStats.todayCases} | Active:{' '}
          {current.context.sgStats.active} <br />
          Deaths: {current.context.sgStats.deaths} | Recovered:{' '}
          {current.context.sgStats.recovered} | Critical:{' '}
          {current.context.sgStats.critical}
        </div>
      )}
    </div>
  )
}

export default HomePage
