import React from "react"
import styled from "styled-components"
import { useMachine } from "@xstate/react"
import CountrySelector from "../components/CountrySelector"
import Stat from "../components/Stat"
import CountrySearch from "../components/CountrySearch"
import GlobalStyles from "../components/GlobalStyles"
import statsMachineConfig from "../components/statsMachineConfig"

const HomePage = () => {
  const [current, send] = useMachine(statsMachineConfig)
  return (
    <div>
      <GlobalStyles />
      <h3>Covid 19 information</h3>
      {current.matches("fetchStats") && <div>loading...</div>}
      {current.matches("error") && <div>fetching stats error</div>}
      {current.matches("ready") && (
        <>
          <CountrySelector
            handleChange={(country) => send("COUNTRY_SELECTED", { country })}
            stats={current.context.stats}
          />
          <CountrySearch
            handleChange={(country) => send("COUNTRY_SELECTED", { country })}
          />
        </>
      )}
      {current.context.countriesSelected.length > 0 && (
        <Stat stats={current.context.countriesSelected} />
      )}
      <Footer>
        Built with &hearts; by{" "}
        <a href="https://github.com/nazmifeeroz">Nazmi</a>
      </Footer>
    </div>
  )
}

const Footer = styled.div`
  margin-top: 50px;
`

export default HomePage
