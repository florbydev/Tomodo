/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { gql, useMutation } from "urql";
import CloseIcon from "@/svgs/CloseIcon";
import PauseIcon from "@/svgs/PauseIcon";
import ListView from "./ListView";
import SessionCounter from "./SessionCounter";
import classNames from "classnames";
import { useTask } from "@/hooks/useTask";

type Props = {
  stopPomodoro: () => void;
};

const ONE_SECOND_MS = 1000;

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${pad(minutes)}:${pad(seconds)}`;
};


const TomodoSessionScreen = ({ stopPomodoro }: Props) => {
  const { sessionTasks, onTaskCompletionUpdate } = useTask(); // ✅ use sessionTasks instead of props
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  const [seconds, setSeconds] = useState(5);
  const [isRunning, setIsRunning] = useState(true);


  const pause = useCallback(() => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  }, []);

  const startIntervalIfNeeded = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, ONE_SECOND_MS);

    setIsRunning(true);
  }, []);

  const resume = useCallback(() => {
    if (seconds <= 0) return;
    startIntervalIfNeeded();
  }, [seconds, startIntervalIfNeeded]);

  const toggle = useCallback(() => {
    if (isRunning) pause();
    else resume();
  }, [isRunning, pause, resume]);

  const stop = useCallback(() => {
    stopPomodoro();
  }, [stopPomodoro]);

  useEffect(() => {
    startIntervalIfNeeded();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [startIntervalIfNeeded]);

  // reset notification flag when timer isn't finished
  useEffect(() => {
    if (seconds > 0) notifiedRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (seconds !== 0) return;
    if (notifiedRef.current) return;
    notifiedRef.current = true;

    void (async () => {
      if (sessionTasks.length === 0) return;
      await onTaskCompletionUpdate();
    })();
  }, [onTaskCompletionUpdate, seconds, sessionTasks]);


  const MAX_SESSIONS = 4;
  const sessionCount = 2;

  return (
    <div className="flex grow items-center justify-between flex-col pt-6 pb-10">
      <div className="flex flex-col flex-1 w-full items-center gap-y-16 py-6">
        <SessionCounter counterValue={formatTime(seconds)} />
        <ListView />
      </div>

      <div className="flex items-center justify-center gap-x-3">
        <div className="flex items-center justify-center gap-x-1">
          {Array.from({ length: MAX_SESSIONS }).map((_, index) => {
            const pillClass = classNames("h-6 w-2 border rounded-full", {
              "bg-primary": index < sessionCount,
            });
            return <div key={index} className={pillClass} />;
          })}
        </div>

        <div className="h-4 w-px bg-[#C29B8C]" />

        <div className="flex gap-x-1.5 items-center justify-center">
          <button
            type="button"
            className="p-1.5 rounded-full border border-outline bg-primary mx-0.5 transition-transform duration-175 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={toggle}
            aria-pressed={isRunning}
            disabled={sessionTasks.length === 0}
          >
            <PauseIcon />
          </button>

          <button
            type="button"
            className="p-1.5 rounded-full border border-outline bg-primary mx-0.5 transition-transform duration-175 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={stop}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TomodoSessionScreen);
