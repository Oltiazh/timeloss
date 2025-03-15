import { useContext } from "react"
import { TabsContext } from "./App"
import React from "react"

export function DomainList() {
  const { domains } = useContext(TabsContext)

  function showTime(domain) {
    let timeSpent = ""
    if (domain >= 3600) {
      timeSpent += Math.floor(domain / 3600).toString() + " h "
    }
    if (domain >= 60) {
      timeSpent += Math.floor((domain / 60) % 60).toString() + " m "
    }
    timeSpent += (domain % 60).toString() + " s"
    return timeSpent
  }

  return (
    <ul>
      {domains.length === 0 ? (
        <p>Open tab</p>
      ) : (
        domains.map((domain) => {
          return (
            <li key={crypto.randomUUID()}>
              {domain[0]} : {showTime(domain[1])}
            </li>
          )
        })
      )}
    </ul>
  )
}
