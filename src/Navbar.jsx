import { Link, useMatch, useResolvedPath } from "react-router-dom"
import React from "react"

export function Navbar() {
  return (
    <nav className="nav">
      <ul>
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/user_settings">Settings</CustomLink>
        <CustomLink to="/pomodoro">Pomodoro</CustomLink>
        <CustomLink to="/export_data">Export Data</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}
