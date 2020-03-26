import React from 'react'

const Stat = ({ stat }) => {
  return (
    <div>
      <b>{stat.country}</b>
      <br />
      Cases: {stat.cases} | Today: {stat.todayCases} | Active: {stat.active}{' '}
      <br />
      Deaths: {stat.deaths} | Recovered: {stat.recovered} | Critical:{' '}
      {stat.critical}
    </div>
  )
}

export default Stat
