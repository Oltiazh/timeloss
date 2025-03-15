import React, { useEffect, useState } from "react"
import Select from "react-select"
import { DEFAULT_KEYS } from "./defaultKeys"

export function UserSettings() {
  const [domains, setDomains] = useState({})
  const [activeDomain, setActiveDomain] = useState()
  const [afkInterval, setAfkInterval] = useState()
  const [tracking, setTracking] = useState()
  const [domainSelect, setDomainSelect] = useState([])
  const [selectedDomains, setSelectedDomains] = useState([])
  const [domainAdd, domainAdded] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(
      [
        DEFAULT_KEYS.DOMAIN_COUNTS,
        DEFAULT_KEYS.ACTIVE_DOMAIN,
        DEFAULT_KEYS.AFK_INTERVAL,
        DEFAULT_KEYS.TRACKING,
      ],
      (data) => {
        setDomains(data[DEFAULT_KEYS.DOMAIN_COUNTS])
        setActiveDomain(data[DEFAULT_KEYS.ACTIVE_DOMAIN])
        setAfkInterval(data[DEFAULT_KEYS.AFK_INTERVAL])
        setTracking(data[DEFAULT_KEYS.TRACKING])
      }
    )
  }, [])

  useEffect(() => {
    setDomainSelect(
      Object.keys(domains).map((domain) => {
        return { value: [domain], label: [domain] }
      })
    )
  }, [domains])

  const afkIntervals = [
    { value: 30, label: "30s" },
    { value: 60, label: "1m" },
    { value: 120, label: "2m" },
    { value: 180, label: "3m" },
    { value: 300, label: "5m" },
    { value: 600, label: "10m" },
  ]

  const isTracking = [
    { value: true, label: "yes" },
    { value: false, label: "no" },
  ]

  const afkChange = (selOption) => {
    chrome.storage.local.set({ [DEFAULT_KEYS.AFK_INTERVAL]: selOption.value })
    setAfkInterval(selOption.value)
  }

  const trackingChange = (selOption) => {
    chrome.storage.local.set({ [DEFAULT_KEYS.TRACKING]: selOption.value })
    setTracking(selOption.value)
  }

  function addToTrack() {
    chrome.storage.local.set({
      [DEFAULT_KEYS.DOMAIN_COUNTS]: Object.assign({}, domains, {
        [activeDomain]: 0,
      }),
    })
    setDomains(
      Object.assign({}, domains, {
        [activeDomain]: 0,
      })
    )
    domainAdded(true)
  }

  function domainsRemove(e) {
    e.preventDefault()
    const temp = { ...domains }
    selectedDomains.forEach((domain) => {
      delete temp[domain.value]
    })
    console.log(`After deletion ${temp}`)
    chrome.storage.local.set({
      [DEFAULT_KEYS.DOMAIN_COUNTS]: temp,
    })
    setDomains(temp)
  }

  const handleSelDomains = (value) => {
    setSelectedDomains(value)
  }

  return (
    <>
      <h2>Afk interval</h2>
      <Select
        defaultValue={afkInterval}
        options={afkIntervals}
        onChange={afkChange}
      />
      <h2>Tracking</h2>
      <Select
        defaultValue={tracking}
        options={isTracking}
        onChange={trackingChange}
      />
      <h2>{domainAdd ? "Domain added" : "Add current domain to track"}</h2>
      <button onClick={addToTrack}>{activeDomain}</button>
      <form onSubmit={domainsRemove}>
        <h2>Remove tracking domains</h2>
        <Select options={domainSelect} onChange={handleSelDomains} isMulti />
        <br />
        <button type="submit">Remove selected domains</button>
      </form>
    </>
  )
}
