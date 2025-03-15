import React, { useEffect, useState } from "react"
import { DEFAULT_KEYS } from "./defaultKeys"
import xlsx from "json-as-xlsx"

export function ExportData() {
  const [exported, setExported] = useState(false)
  const [prevDomainData, setPrevDomainData] = useState([])

  useEffect(() => {
    chrome.storage.local.get([DEFAULT_KEYS.PREV_DOMAIN_DATA], (data) => {
      setPrevDomainData(Object.entries(data[DEFAULT_KEYS.PREV_DOMAIN_DATA]))
    })
  }, [])

  function handleClick() {
    let allDomains = new Set()
    prevDomainData.forEach(([date, domains]) => {
      Object.keys(domains).forEach((domain) => {
        allDomains.add(domain)
      })
    })

    let contentData = []

    allDomains.forEach((domain) => {
      let domainObject = { domain: domain }

      prevDomainData.forEach(([date, domains], index) => {
        const dt = new Date(null)
        dt.setSeconds(domains[domain] || 0)
        let timeFormatted = dt.toISOString().slice(11, 19)
        if (timeFormatted.startsWith("0", 0)) {
          timeFormatted = timeFormatted.slice(1)
        }
        domainObject[`day${index}`] = timeFormatted
      })

      contentData.push(domainObject)
    })

    let excelData = [
      {
        sheet: "Time",
        columns: [
          { label: "Domain", value: "domain" },
          ...prevDomainData.map((d, index) => {
            return {
              label: d[0],
              value: `day${index}`,
              format: "h:mm:ss",
            }
          }),
        ],
        content: contentData,
      },
    ]

    let excelSettings = {
      fileName: "TimeLoss_Spreadsheet",
    }
    xlsx(excelData, excelSettings)
    setExported(!exported)
  }

  return (
    <div>
      <button onClick={handleClick}>Export data</button>
      {exported ? <h2>Choose directory to store file</h2> : null}
    </div>
  )
}
