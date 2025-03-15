import React, { useEffect, useState } from "react"
import { DEFAULT_KEYS } from "./defaultKeys"

export function Pomodoro() {
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroTimePassed, setPomodoroTimePassed] = useState()

  useEffect(() => {
    chrome.storage.local.get(
      [DEFAULT_KEYS.POMODORO_ACTIVE, DEFAULT_KEYS.POMODORO_TIME_PASSED],
      (data) => {
        setPomodoroActive(data[DEFAULT_KEYS.POMODORO_ACTIVE])
        setPomodoroTimePassed(data[DEFAULT_KEYS.POMODORO_TIME_PASSED])
      }
    )
  }, [])

  const handleChange = (e) => {
    setPomodoroActive(e.target.checked)

    if (e.target.checked) {
      chrome.storage.local.set({
        [DEFAULT_KEYS.POMODORO_ACTIVE]: e.target.checked,
      })
    } else {
      setPomodoroTimePassed(0)
      chrome.storage.local.set({
        [DEFAULT_KEYS.POMODORO_ACTIVE]: e.target.checked,
        [DEFAULT_KEYS.POMODORO_TIME_PASSED]: 0,
      })
    }
  }

  return (
    <div className={pomodoroActive ? "pomodoro" : null}>
      <h1>
        {pomodoroActive ? "Pomodoro Timer is Active" : "Turn on Pomodoro timer"}
      </h1>
      <input type="checkbox" checked={pomodoroActive} onChange={handleChange} />
      <div>{`${(pomodoroTimePassed / 60).toFixed(0)} m  ${
        pomodoroTimePassed % 60
      } s`}</div>
    </div>
  )
}
