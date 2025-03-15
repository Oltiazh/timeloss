import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles.css"
import { MemoryRouter as Router } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)

function onFocus() {
  chrome.runtime.sendMessage("resetInterval", (response) => {
    console.log(response.status)
  })
}

window.addEventListener("focus", onFocus)

window.addEventListener("unload", () => {
  window.removeEventListener("focus", onFocus)
})
