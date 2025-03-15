const DOMAINS = {
  "google.com": 0,
  "x.com": 0,
  "youtube.com": 0,
  "dl.nure.ua": 0,
}
const DEFAULT_KEYS = {
  PREV_DOMAIN_DATA: "prev_domain_data",
  DOMAIN_COUNTS: "domain_counts",
  UPDATE_TIME: "update_time",
  ACTIVE_DOMAIN: "active_domain",
  TRACKING: "tracking",
  AFK_INTERVAL: "afk_interval",
  POMODORO_ACTIVE: "pomodoro_active",
  POMODORO_TIME_PASSED: "pomodoro_time_passed",
}
const UPDATE_INTERVAL = 1

let intervalID, notificationID

const resetStorage = () => {
  let updatedData = {}
  const dateObj = new Date().toLocaleDateString()
  Object.assign(updatedData, {
    [DEFAULT_KEYS.DOMAIN_COUNTS]: DOMAINS,
    [DEFAULT_KEYS.UPDATE_TIME]: dateObj,
    [DEFAULT_KEYS.ACTIVE_DOMAIN]: "",
    [DEFAULT_KEYS.TRACKING]: true,
    [DEFAULT_KEYS.AFK_INTERVAL]: 180,
    [DEFAULT_KEYS.PREV_DOMAIN_DATA]: {},
    [DEFAULT_KEYS.POMODORO_ACTIVE]: false,
    [DEFAULT_KEYS.POMODORO_TIME_PASSED]: 0,
  })
  chrome.storage.local.set(updatedData)
}

function toDomain(url) {
  let domain = new URL(url).hostname
  return domain.replace("www.", "")
}

function checkTime(updateTime) {
  const currTime = new Date().toLocaleDateString()
  if (updateTime == currTime) {
    return false
  }
  return currTime
}

function makeNotification(msg) {
  clearNotification()
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "icon.png",
      title: "Pomodoro",
      message: msg,
    },
    (generatedID) => (notificationID = generatedID)
  )
}

function clearNotification() {
  if (notificationID) {
    chrome.notifications.clear(notificationID)
  }
}

function updateData() {
  chrome.storage.local.get(null, (data) => {
    if (data[DEFAULT_KEYS.TRACKING]) {
      chrome.idle.queryState(data[DEFAULT_KEYS.AFK_INTERVAL], (newState) => {
        if (newState === "active") {
          chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            (tabs) => {
              if (tabs.length === 0) {
                return
              }

              const tab = tabs[0]
              const domain = toDomain(tab.url)
              let domainCounts = Object.assign(
                {},
                data[DEFAULT_KEYS.DOMAIN_COUNTS] || {}
              )
              let pomodoroTimer = data[DEFAULT_KEYS.POMODORO_TIME_PASSED] || 0

              const check_time = checkTime(data[DEFAULT_KEYS.UPDATE_TIME])
              if (typeof check_time === "string") {
                let updatedData = {}
                Object.keys(domainCounts).forEach((key) => {
                  domainCounts[key] = 0
                })

                Object.assign(updatedData, {
                  [DEFAULT_KEYS.ACTIVE_DOMAIN]: domain,
                  [DEFAULT_KEYS.AFK_INTERVAL]: data[DEFAULT_KEYS.AFK_INTERVAL],
                  [DEFAULT_KEYS.DOMAIN_COUNTS]: domainCounts,
                  [DEFAULT_KEYS.POMODORO_ACTIVE]:
                    data[DEFAULT_KEYS.POMODORO_ACTIVE],
                  [DEFAULT_KEYS.POMODORO_TIME_PASSED]: 0,
                  [DEFAULT_KEYS.PREV_DOMAIN_DATA]: Object.assign(
                    {},
                    {
                      [data[DEFAULT_KEYS.UPDATE_TIME]]:
                        data[DEFAULT_KEYS.DOMAIN_COUNTS],
                      ...data[DEFAULT_KEYS.PREV_DOMAIN_DATA],
                    }
                  ),
                  [DEFAULT_KEYS.TRACKING]: data[DEFAULT_KEYS.TRACKING],
                  [DEFAULT_KEYS.UPDATE_TIME]: check_time,
                })
                chrome.storage.local.clear()
                chrome.storage.local.set(updatedData)
                return
              }

              if (data[DEFAULT_KEYS.POMODORO_ACTIVE]) {
                if (pomodoroTimer === 1500) {
                  makeNotification("Rest time: 5 min")
                } else if (pomodoroTimer === 1800) {
                  makeNotification("Work time: 25 min")
                  pomodoroTimer = -1
                }

                pomodoroTimer += UPDATE_INTERVAL
              }

              if (domain in domainCounts) {
                domainCounts[domain] += UPDATE_INTERVAL
              }

              chrome.storage.local.set({
                [DEFAULT_KEYS.DOMAIN_COUNTS]: domainCounts,
                [DEFAULT_KEYS.ACTIVE_DOMAIN]: domain,
                [DEFAULT_KEYS.POMODORO_TIME_PASSED]: pomodoroTimer,
              })
            }
          )
        }
      })
    }
  })
}

function startInterval() {
  intervalID = setInterval(updateData, 1000)
}

function clearIntervalIfExists() {
  if (intervalID) {
    clearInterval(intervalID)
  }
}

chrome.runtime.onInstalled.addListener(resetStorage)
startInterval()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "resetInterval") {
    clearIntervalIfExists()
    startInterval()
    sendResponse({ status: "Interval reset" })
  }
})
