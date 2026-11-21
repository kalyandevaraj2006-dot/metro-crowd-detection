"use client"
import { useState, useEffect } from "react"

export default function CrowdCamera() {
  const [coaches, setCoaches] = useState([
    { no: 1, people: 282, capacity: 300 },
    { no: 2, people: 235, capacity: 300 },
    { no: 3, people: 98, capacity: 300 },
    { no: 4, people: 261, capacity: 300 },
    { no: 5, people: 148, capacity: 300 },
    { no: 6, people: 272, capacity: 300 },
  ])
  const [station, setStation] = useState("Majestic")
  const [line, setLine] = useState("Purple Line 🟣")
  const [nextTrain, setNextTrain] = useState(2)

  // LIVE UPDATE EVERY 2 SECONDS - like real CCTV
  useEffect(() => {
    const timer = setInterval(() => {
      setCoaches(prev => prev.map(c => {
        let change = Math.floor(Math.random() * 17 - 8) // -8 to +8 people
        let newPeople = c.people + change
        if (newPeople < 15) newPeople = 15
        if (newPeople > 298) newPeople = 298
        return { ...c, people: newPeople }
      }))
      setNextTrain(prev => prev <= 1 ? 5 : prev - 1)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const totalPeople = coaches.reduce((sum, c) => sum + c.people, 0)
  const totalCapacity = coaches.reduce((sum, c) => sum + c.capacity, 0)
  const totalPct = Math.round((totalPeople / totalCapacity) * 100)
  const best = coaches.reduce((a, b) => (a.people / a.capacity) < (b.people / b.capacity) ? a : b)

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      {/* TOP BAR */}
      <div className="flex flex-wrap gap-2 justify-between items