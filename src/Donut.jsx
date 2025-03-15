import React, { useContext } from "react"
import { TabsContext } from "./App"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
ChartJS.register(ArcElement, Tooltip, Legend)

export function Donut() {
  const { domains } = useContext(TabsContext)

  const overallTime = domains
    .map((domain) => domain[1])
    .reduce((result, val) => result + val, 0)

  const data = {
    labels: domains.map((domain) => {
      return domain[0]
    }),
    datasets: [
      {
        label: "Percentage of time spent",
        data: domains.map((domain) => {
          return ((domain[1] / overallTime) * 100).toFixed(2)
        }),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "#050f80",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "#050f80",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <>{overallTime == 0 ? <h1>No data, yet</h1> : <Doughnut data={data} />}</>
  )
}
