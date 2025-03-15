import React, { createContext, useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import { DomainList } from "./DomainList"
import { Donut } from "./Donut"
import { Navbar } from "./Navbar"
import { UserSettings } from "./UserSettings"
import { Pomodoro } from "./Pomodoro"
import { DEFAULT_KEYS } from "./defaultKeys"
import { ExportData } from "./ExportData"

export const TabsContext = createContext()

function App() {
  const [domains, setDomains] = useState([])

  useEffect(() => {
    chrome.storage.local.get([DEFAULT_KEYS.DOMAIN_COUNTS], (data) => {
      setDomains(Object.entries(data[DEFAULT_KEYS.DOMAIN_COUNTS]))
    })
  }, [])

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <TabsContext.Provider
                value={{
                  domains,
                }}
              >
                <Donut />
                <DomainList />
              </TabsContext.Provider>
            }
          />
          <Route path="/user_settings" element={<UserSettings />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/export_data" element={<ExportData />} />
        </Routes>
      </div>
    </>
  )
}

export default App
