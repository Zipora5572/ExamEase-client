// "use client"

// import { useEffect, useRef } from "react"
// import { Chart, registerables } from "chart.js"

// Chart.register(...registerables)

// const ChartContainer = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null)

//   useEffect(() => {
//     if (!canvasRef.current) return

//     const chartInstance = new Chart(canvasRef.current, {
//       type: "bar",
//       data: {
//         labels: ["Red", "Blue", "Yellow"],
//         datasets: [
//           {
//             label: "Votes",
//             data: [12, 19, 3],
//             backgroundColor: ["red", "blue", "yellow"],
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//       }
      
//     })

//     return () => {
//       chartInstance.destroy()
//     }
//   }, [])

//   return (
//    <div className="relative h-[300px] w-full max-w-xl">
// <canvas
//   ref={canvasRef}
//   width={640}
//   height={300}
//   className="w-full h-full"
// />

// </div>

//   )
  
// }

// export default ChartContainer
