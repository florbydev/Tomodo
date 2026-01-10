import Checkmark from "@/components/shared/ui/Checkmark";
import { PomoCount } from "@/components/shared/ui/PomoCount";
import type { TaskType } from "@/components/types";
import { useTask } from "@/hooks/useTask";
import FileIcon from "@/svgs/big-svgs/FileIcon";
import CloseIcon from "@/svgs/CloseIcon";
import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";

type Props = {
  open: boolean;
  hide: () => void;
};

type Id = TaskType["id"];

const SessionPanel = ({ open, hide }: Props) => {
  const { sessionTasks, setSessionTasks, onTasksComplete } = useTask();

  // Store only ids for performance + correctness
  const [selectedIds, setSelectedIds] = useState<Set<Id>>(() => new Set());

  const onToggleTask = useCallback((taskId: Id) => {
    setSelectedIds(prev => {
      // IMPORTANT: copy because Set is mutable
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }, []);

  const selectedCount = selectedIds.size;

  // If you still need the TaskType[] for actions, derive it cheaply
  const selectedTasks = useMemo(() => {
    if (selectedIds.size === 0) return [];
    return sessionTasks.filter(t => selectedIds.has(t.id));
  }, [sessionTasks, selectedIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const removeSelected = useCallback(() => {
    if (selectedIds.size === 0) return;

    setSessionTasks(prev => prev.filter(task => !selectedIds.has(task.id)));
    clearSelection();
  }, [selectedIds, setSessionTasks, clearSelection]);

  // Placeholder: plug in your "complete" logic here
  const markSelectedAsComplete = useCallback(async () => {
    if (selectedIds.size === 0) return;

    // snapshot the selection for this click
    const ids = Array.from(selectedIds);
    const idsSet = new Set(ids);

    await onTasksComplete(ids);

    setSessionTasks(prev => prev.filter(task => !idsSet.has(task.id)));
    clearSelection();
  }, [selectedIds, onTasksComplete, setSessionTasks, clearSelection]);


  if (!open) return null;

  return (
    <div className="absolute h-102 w-2xl bg-primary-muted border border-outline rounded-md p-4 bottom-28 flex z-10">
      <div className="flex flex-col w-full gap-y-3">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm text-outline">Session Tasks</p>
          <button onClick={hide} type="button" className="cursor-pointer">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-1 overflow-auto flex-col justify-between">
          {sessionTasks.length > 0 ? (
            <>
              <div className="max-h-72 overflow-auto">
                <ul className="flex flex-col w-full">
                  {sessionTasks.map(task => {
                    const isChecked = selectedIds.has(task.id);

                    const liClass = classNames(
                      "flex py-1.5 px-2 items-center gap-x-2 rounded-md select-none cursor-pointer",
                      { "bg-primary-selected": isChecked }
                    );

                    return (
                      <li
                        key={task.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onToggleTask(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") onToggleTask(task.id);
                        }}
                        className={liClass}
                      >
                        <Checkmark checked={isChecked} />
                        <PomoCount
                          estimated={task.target_sessions}
                          current={task.completed_sessions}
                        />
                        <span className="font-light text-outline leading-[150%]">
                          {task.title}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {selectedCount > 0 && (
                <div className="pt-4 border-t border-outline flex gap-x-2 bg-primary-muted">
                  <button
                    type="button"
                    onClick={markSelectedAsComplete}
                    className="flex items-center justify-center gap-x-1 px-2 py-1 border border-outline rounded-md cursor-pointer bg-primary"
                  >
                    <span className="text-xs">Mark as Complete</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#3F1F12"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={removeSelected}
                    className="flex items-center justify-center gap-x-1 px-2 py-1 border border-outline rounded-md cursor-pointer bg-[#FFA2A2]"
                  >
                    <span className="text-xs">Remove</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <g clipPath="url(#clip0_592_1505)">
                        <path
                          d="M9.5 3V10C9.5 10.2652 9.39464 10.5196 9.20711 10.7071C9.01957 10.8946 8.76522 11 8.5 11H3.5C3.23478 11 2.98043 10.8946 2.79289 10.7071C2.60536 10.5196 2.5 10.2652 2.5 10V3"
                          stroke="#3F1F12"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.5 3H10.5"
                          stroke="#3F1F12"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 3V2C4 1.73478 4.10536 1.48043 4.29289 1.29289C4.48043 1.10536 4.73478 1 5 1H7C7.26522 1 7.51957 1.10536 7.70711 1.29289C7.89464 1.48043 8 1.73478 8 2V3"
                          stroke="#3F1F12"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_592_1505">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 grow shrink-0 flex items-center justify-center flex-col gap-y-2">
              <FileIcon />
              <p className="text-sm font-light">No tasks at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPanel;
