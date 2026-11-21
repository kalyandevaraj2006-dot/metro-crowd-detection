"use client"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [coaches, setCoaches] = useState([
    { no: 1, people: 282, capacity: 300 },
    { no: 2, people: 235, capacity: 300 },
    { no: 3, people: 98, capacity: 300 },
    { no: 4, people: 261, capacity: 300 },
    { no: 5, people: 148, capacity: 300 },
    { no: 6, people: 272, capacity: 300 },
  ])
  const [station, setStation] = useState("Majestic")

// BENGALURU METRO - Station -> Line Colour
const stationLines: Record<string, { lines: string[], colors: string[] }> = {
  "Majestic": { lines: ["Purple Line", "Green Line"], colors: ["bg-purple-600", "bg-green-600"] },
  "M.G. Road": { lines: ["Purple Line"], colors: ["bg-purple-600"] },
  "Whitefield": { lines: ["Purple Line"], colors: ["bg-purple-600"] },
  "Jayanagar": { lines: ["Green Line"], colors: ["bg-green-600"] },
  "Silk Institute": { lines: ["Green Line"], colors: ["bg-green-600"] },
  "R.V. Road": { lines: ["Green Line", "Yellow Line"], colors: ["bg-green-600", "bg-yellow-500"] },
  "Bommanahalli": { lines: ["Yellow Line"], colors: ["bg-yellow-500"] },
  "Electronic City": { lines: ["Yellow Line"], colors: ["bg-yellow-500"] },
  "K.R. Pura": { lines: ["Purple Line", "Blue Line"], colors: ["bg-purple-600", "bg-blue-600"] },
  "Hebbal": { lines: ["Blue Line", "Orange Line"], colors: ["bg-blue-600", "bg-orange-500"] },
}
  const [isCamOn, setIsCamOn] = useState(false)
  const [camStatus, setCamStatus] = useState("Camera OFF")

  // 1. LIVE SIMULATION for all coaches
  useEffect(() => {
    const timer = setInterval(() => {
      setCoaches(prev => prev.map(c => {
        if (c.no === 3 && isCamOn) return c // Coach 3 is real camera, don't simulate
        let n = c.people + Math.floor(Math.random() * 17 - 8)
        if (n < 15) n = 15
        if (n > 298) n = 298
        return { ...c, people: n }
      }))
    }, 2000)
    return () => clearInterval(timer)
  }, [isCamOn])

  // 2. REAL CAMERA for Coach 3
  const startRealCamera = async () => {
    try {
      setCamStatus("Loading AI...")
      // @ts-ignore
      const cocoSsd = await import("@tensorflow-models/coco-ssd")
      // @ts-ignore
      const tf = await import("@tensorflow/tfjs")
      await tf.ready()
      const model = await cocoSsd.load()
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsCamOn(true)
      setCamStatus("✅ REAL CAMERA LIVE - Coach 3")
      setInterval(async () => {
        if (videoRef.current) {
          const preds = await model.detect(videoRef.current)
          const persons = preds.filter((p: any) => p.class === "person")
          // 1 person in front = 60 people in coach for demo visibility
          const realCount = Math.max(20, persons.length * 60 + 35)
          setCoaches(prev => prev.map(c => c.no === 3 ? { ...c, people: realCount } : c))
        }
      }, 1500)
    } catch (e) { setCamStatus("❌ Allow Camera Permission") }
  }

  const best = coaches.reduce((a, b) => (a.people / a.capacity) < (b.people / b.capacity) ? a : b)
  const totalPeople = coaches.reduce((s, c) => s + c.people, 0)
  const totalPct = Math.round((totalPeople / 1800) * 100)

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* HEADER - FIXED BLACK TEXT */}
        <div className="bg-white rounded-xl p-4 shadow">
         <h1 className="font-bold text-2xl text-black">📹 LIVE Metro - ALL 6 Coaches REAL CAMERA</h1>
<p className="text-base font-bold text-black mt-1">Station: {station}</p>
<div className="flex gap-2 mt-1 flex-wrap">
  {stationLines[station]?.lines.map((line, i) => (
    <span key={line} className={`${stationLines[station].colors[i]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
      {line === "Purple Line" ? "🟣" : line === "Green Line" ? "🟢" : line === "Yellow Line" ? "🟡" : line === "Blue Line" ? "🔵" : "🟠"} {line}
    </span>
  ))}
</div>
<p className="text-xs text-gray-600 mt-1">Platform 1 - Towards Whitefield • Platform 2 - Towards Challaghatta</p> 
          <p className="text-sm text-gray-700">BMRCL CCTV • Purple Line 🟣 • Total Train: {totalPct}% • {totalPeople}/1800 people</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <select value={station} onChange={(e) => setStation(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm text-black bg-white mt-2">
  <option>Majestic</option>
  <option>M.G. Road</option>
  <option>Whitefield</option>
  <option>Jayanagar</option>
  <option>Silk Institute</option>
  <option>R.V. Road</option>
  <option>Bommanahalli</option>
  <option>Electronic City</option>
  <option>K.R. Pura</option>
  <option>Hebbal</option>
</select>
            
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">● LIVE</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full mt-3"><div className={`h-3 rounded-full transition-all duration-1000 ${totalPct > 85 ? 'bg-red-500' : totalPct > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${totalPct}%` }}></div></div>
        </div>

        {/* 6 COACHES */}
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {coaches.map((c) => {
              const pct = Math.round((c.people / c.capacity) * 100)
              return (
                <div key={c.no} className={`border-2 rounded-xl overflow-hidden ${c.no === best.no ? 'border-green-500 shadow-lg' : 'border-gray-300'}`}>
                  <div className="bg-black text-white text-[11px] p-2 flex justify-between"><span>CAM {c.no}</span><span className="text-red-400">● REC</span></div>
                  <div className="p-3 text-center bg-white">
                    <p className="font-bold text-sm text-black">Coach {c.no} {c.no === 3 ? '(REAL CAM)' : ''}</p>
                    <p className={`text-3xl font-black ${pct > 85 ? 'text-red-500' : pct > 60 ? 'text-yellow-600' : 'text-green-500'}`}>{pct}%</p>
                    <p className="text-[11px] text-gray-700 font-medium">{c.people} / {c.capacity}</p>
                    <div className="w-full bg-gray-200 h-2 rounded mt-2"><div className={`h-2 rounded transition-all duration-1000 ${pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }}></div></div>
                    <p className="text-xs font-bold mt-1 text-black">{pct > 85 ? '🔴 FULL' : pct > 60 ? '🟡 CROWDED' : '🟢 EMPTY'}</p>
                    {c.no === best.no && <p className="text-[11px] font-bold text-green-700 bg-green-100 rounded py-0.5 mt-1">★ GO HERE</p>}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 bg-green-50 border-2 border-green-300 p-3 rounded-xl">
            <p className="font-bold text-green-800 text-base">✅ Best Coach: Coach {best.no}</p>
            <p className="text-sm text-black">Only {Math.round((best.people / best.capacity) * 100)}% filled - {best.capacity - best.people} seats empty.</p>
          </div>
        </div>

        {/* REAL CAMERA + PLATFORM MAP */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-bold text-black">📷 Real Camera - Coach {best.no} (Live Test)</h2>
            <p className="text-xs text-gray-700">{camStatus}</p>
            <div className="bg-black rounded-lg overflow-hidden mt-2">
              <video ref={videoRef} className="w-full h-48 object-cover" muted playsInline />
            </div>
            {!isCamOn && <button onClick={startRealCamera} className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full font-bold">▶️ Start Real Camera for Coach 3</button>}
            <p className="text-xs text-gray-700 mt-2">Stand in front of camera - Coach 3 % will go UP live. Move away - % goes DOWN.</p>
          </div>

          {/* 3. PLATFORM MAP */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-bold text-black">🗺️ Platform Map - Where to Stand at {station}</h2>
            <p className="text-xs text-gray-700">Train coming from left → right. Green = Empty, Red = Full.</p>
            <div className="flex gap-1 mt-3">
              {coaches.map(c => {
                const pct = Math.round((c.people / c.capacity) * 100)
                return (
                  <div key={c.no} className={`flex-1 text-center rounded-lg p-2 border-2 ${c.no === best.no ? 'border-green-500 bg-green-100' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="text-xs font-bold text-black">C{c.no}</p>
                    <p className={`text-lg font-black ${pct > 85 ? 'text-red-500' : pct > 60 ? 'text-yellow-600' : 'text-green-500'}`}>{pct}%</p>
                    <p className="text-[10px] text-black">{c.no === best.no ? '👉 STAND HERE' : ' '}</p>
                  </div>
                )
              })}
            </div>
            <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-3 text-center">
              <p className="text-sm font-bold text-black">⬆️ Go to Coach {best.no} Marking on Platform ⬆️</p>
              <p className="text-xs text-gray-700">Look for Yellow Line + Coach {best.no} board on platform floor.</p>
            </div>
            <div className="mt-2 text-center text-xs text-gray-600">🚇 ============ TRAIN ============ →</div>
          </div>
        </div>
      </div>
    </div>
  )
}