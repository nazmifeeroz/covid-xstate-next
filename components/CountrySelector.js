import React from 'react'

const Stats = ({ handleChange, stats }) => (
  <div>
    Select a country:{' '}
    <select onChange={handleChange}>
      <option>Select a country</option>
      {stats.map((stat, i) => (
        <option key={`${stat.country}-${i}`}>{stat.country}</option>
      ))}
    </select>
  </div>
)

export default Stats
