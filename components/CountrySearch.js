import React from 'react'

const CountrySearch = ({ handleChange }) => {
  return (
    <input
      onChange={handleChange}
      placeholder="Search for a country"
      type="search"
    />
  )
}

export default CountrySearch
