import { useCallback, useEffect, useRef, useState } from "react"
import CloseIcon from "@/svgs/CloseIcon"
import PauseIcon from "@/svgs/PauseIcon"
import ListView from "./ListView"
import SessionCounter from "./SessionCounter"

type Props = {
  stopPomodoro: () => void
}

const ONE_SECOND_MS = 1000

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (v: number) => String(v).padStart(2, "0")
  return `${pad(minutes)}:${pad(seconds)}`
}

const TomodoSessionScreen = ({ stopPomodoro }: Props) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [seconds, setSeconds] = useState(200)
  const [isRunning, setIsRunning] = useState(true) // ✅ auto-start state

  const pause = () => {
    if (!intervalRef.current) return
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
  }

  const startIntervalIfNeeded = useCallback(
    () => {
      if (intervalRef.current) return

      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            setIsRunning(false)
            pause()
            setSeconds(0)
            return 0
          }
          return prev - 1
        })
      }, ONE_SECOND_MS)

    }, [])

  const resume = () => {
    startIntervalIfNeeded()
    setIsRunning(true)
  }

  const toggle = () => {
    if (isRunning) pause()
    else resume()
  }

  const stop = () => {
    stopPomodoro()
  }

  useEffect(() => {
    startIntervalIfNeeded()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [startIntervalIfNeeded])

  return (
    <div className="flex grow items-center justify-between flex-col">
      <div className="flex flex-col flex-1 w-full items-center gap-y-6">
        <SessionCounter counterValue={formatTime(seconds)} />
        <ListView />
      </div>

      <div>
        <button
          className="px-3 py-1.5 rounded-full border border-outline bg-primary mx-0.5"
          onClick={toggle}
        >
          <PauseIcon />
        </button>

        <button
          className="px-3 py-1.5 rounded-full border border-outline bg-primary mx-0.5"
          onClick={stop}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

export default TomodoSessionScreen
