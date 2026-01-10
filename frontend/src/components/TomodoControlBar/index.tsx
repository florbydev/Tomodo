import Float from "@/components/TomodoControlBar/Float"
import { useTask } from "@/hooks/useTask"
import MusicIcon from "@/svgs/MusicIcon"
import SettingsIcon from "@/svgs/SettingsIcon"

type Props = {
  togglePanel: () => void;
  startPomodoro: () => void;
}

const TomodoControlBar = ({ togglePanel, startPomodoro }: Props) => {

  const { sessionTasks } = useTask();

  return (
    <div className="px-4 py-2 rounded-lg bg-primary-hover flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <button className="flex items-center justify-center" onClick={togglePanel}>
          <Float value={sessionTasks.length} />
        </button>
        <p
          className="
            font-light text-base leading-[150%] tracking-[1.5%]
            max-w-86
            truncate whitespace-nowrap overflow-hidden
            bg-[linear-gradient(90deg,#3F1F12_0%,#723821_72%,rgba(165,81,47,0)_100%)]
            bg-clip-text text-transparent"
        >
          {sessionTasks.length > 0 ? sessionTasks[0].title : 'Nothing to add here...'}
        </p>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <button
          onClick={startPomodoro}
          disabled={sessionTasks.length <= 0}
          className="
            border border-outline rounded-full px-3 py-1.5
            bg-primary text-outline font-medium text-sm whitespace-nowrap
            transition-transform duration-175 ease-out
            hover:scale-101
            active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Pomodoro (25/5)
        </button>

        <div className="flex items-center justify-center gap-x-4">
          <MusicIcon />
          <SettingsIcon />
        </div>
      </div>

    </div>
  )
}

export default TomodoControlBar