import { useState } from "react";
import classNames from "classnames";

import TomodoControlBar from "@/components/TomodoControlBar";
import SessionPanel from "@/components/TomodoControlBar/SessionPanel";
import TomodoTaskInput from "@/components/TomodoTaskInput";
import TomodoTaskList from "@/components/TomodoTaskList";
import { TaskProvider } from "@/contexts/TaskProvider";
import { useModal } from "@/hooks/useModal";
import TomodoSessionScreen from "@/components/TomodoSessionScreen";

function App() {
  const { open, hide, toggle } = useModal();
  const [flipped, setFlipped] = useState(false);

  const startPomodoro = () => setFlipped(true);
  const stopPomodoro = () => setFlipped(false);

  const sceneClass = classNames(
    "perspective-distant",
    "w-180"
  );

  const cardClass = classNames(
    "relative",
    "transition-transform",
    "duration-500",
    "ease-out",
    "transform-3d",
    {
      "transform-[rotateY(180deg)]": flipped,
    }
  );

  const faceBaseClass = classNames(
    "flex",
    "flex-col",
    "gap-y-4.5",
    "rounded-md",
    "bg-white",
    "p-6",
    "border",
    "border-[#3C1E11]",
    "backface-hidden",
    "[webkit-backface-visibility:hidden]",
    "h-[456px]" // ✅ fixed height added
  );

  const frontFaceClass = classNames(
    "relative",
    faceBaseClass
  );

  const backFaceClass = classNames(
    "absolute",
    "inset-0",
    "transform-[rotateY(180deg)]",
    faceBaseClass
  );

  return (
    <main className="min-h-screen w-full flex bg-[#FFD8B5] font-inter">
      <div className="flex-1 flex items-center justify-center flex-col">
        <div className={sceneClass}>
          <div className={cardClass}>
            <TaskProvider>

              {/* FRONT */}
              <div className={frontFaceClass}>
                <TomodoTaskInput />
                <TomodoTaskList />
                <TomodoControlBar
                  startPomodoro={startPomodoro}
                  togglePanel={toggle}
                />
                <SessionPanel open={open} hide={hide} />
              </div>

              {/* BACK */}
              <div className={backFaceClass}>
                {flipped && (
                  <TomodoSessionScreen stopPomodoro={stopPomodoro} />
                )}
              </div>

            </TaskProvider>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
