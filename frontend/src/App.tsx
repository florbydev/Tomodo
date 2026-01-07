import { useState } from "react";
import classNames from "classnames";

import TomodoControlBar from "@/components/TomodoControlBar";
import SessionPanel from "@/components/TomodoControlBar/SessionPanel";
import TomodoTaskInput from "@/components/TomodoTaskInput";
import TomodoTaskList from "@/components/TomodoTaskList";
import { TaskProvider } from "@/contexts/TaskProvider";
import { useModal } from "@/hooks/useModal";
import { PomoCount } from "@/components/shared/ui/PomoCount";
import PauseIcon from "@/svgs/PauseIcon";
import CloseIcon from "@/svgs/CloseIcon";

function App() {
  const { open, hide, toggle } = useModal();
  const [flipped, setFlipped] = useState(true);

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
    "[webkit-backface-visibility:hidden]"
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

            {/* FRONT */}
            <div className={frontFaceClass}>
              <TaskProvider>
                <TomodoTaskInput />
                <TomodoTaskList />
                <TomodoControlBar
                  startPomodoro={startPomodoro}
                  togglePanel={toggle}
                />
                <SessionPanel open={open} hide={hide} />
              </TaskProvider>
            </div>

            {/* BACK */}
            <div className={backFaceClass}>
              <div className="flex grow items-center justify-between flex-col">
                <div className="flex flex-col flex-1 w-full items-center gap-y-6">
                  <div className="flex items-end gap-x-2">
                    <p className="text-8xl font-semibold text-outline text-">14:32</p>
                    <div className="flex gap-x-1 mb-3">
                      <div className="h-6 w-2 border rounded-full bg-primary" />
                      <div className="h-6 w-2 border rounded-full bg-primary" />
                      <div className="h-6 w-2 border rounded-full" />
                      <div className="h-6 w-2 border rounded-full" />
                    </div>
                  </div>
                  <div className="px-11.5 w-full flex items-center justify-center">
                    <div className="border border-outline bg-primary-muted p-4 w-full rounded-md">
                      <p className="font-medium text-sm mb-3 text-outline">Session Tasks</p>
                      <ul>
                        <li className="flex py-1 px-2 items-baseline">
                          <PomoCount estimated={4} current={1} />
                          <span className=" font-light text-outline leading-[150%] ml-2">
                            Creating and maintaining system architecture docs.
                          </span>
                        </li>
                        <li className="flex py-1 px-2 items-baseline">
                          <PomoCount estimated={4} current={2} />
                          <span className=" font-light text-outline  leading-[150%] ml-2">
                            Implementing automated tests for integration and E2E scenarios.
                          </span>
                        </li>
                        <li className="flex py-1 px-2 items-baseline">
                          <PomoCount estimated={4} current={8} />
                          <span className=" font-light text-outline leading-[150%] ml-2">
                            Designing scalable microservices architectures.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="px-3 py-1.5 rounded-full border border-outline bg-primary mx-0.5"><PauseIcon /></button>
                  <button className="px-3 py-1.5 rounded-full border border-outline bg-primary mx-0.5" onClick={stopPomodoro}> <CloseIcon /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
