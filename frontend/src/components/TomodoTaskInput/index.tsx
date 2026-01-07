import {
  type JSX,
  useMemo,
  useState,
} from "react";
import Pomo from "@/svgs/Pomo";
import SubmitArrow from "@/svgs/SubmitArrow";
import { useTask } from "@/hooks/useTask";
import Dropdown from "@/components/TomodoTaskInput/Dropdown";
import type { ProjectType } from "@/components/types";

type FormValues = {
  task: string;
  project: ProjectType;
  pomoCount: number;
};

const TomodoTaskInput = (): JSX.Element => {
  const { setActiveTasks, projectList } = useTask();

  const initialValue = useMemo(() => {
    return {
      task: "",
      project: projectList[0],
      pomoCount: 1,
    }
  }, [projectList])
  const [values, setValues] = useState<FormValues>(initialValue);

  console.log('values', values);


  return (
    <form onSubmit={(e) => {
      e.preventDefault();

      const tempId = 'temp-' + crypto.randomUUID();
      const tempUserId = 'nothingham-123';

      setActiveTasks(prev => [{
        id: tempId,
        userId: tempUserId,
        project: values.project,
        completed: false,
        description: values.task,
        estimatedCount: values.pomoCount,
        currentCount: 0
      }, ...prev])

      setValues(initialValue)

    }} className="flex items-center gap-3 border-b border-outline py-1.5">

      <Dropdown
        projectList={projectList}
        value={values.project}
        onClick={(newProject) => {
          setValues((v) => ({ ...v, project: newProject }));
        }}
      />

      {/* Task input */}
      <input
        name="task"
        type="text"
        value={values.task}
        onChange={(e) => {
          setValues((v) => {
            console.log('Meaning', { ...v, task: e.target.value });
            return { ...v, task: e.target.value }
          })
        }}
        placeholder="What are you working on?"
        className="flex-1 rounded text-base placeholder:font-light focus:outline-none"
        required
      />

      <div className="inline-flex items-center justify-center">
        <button
          onClick={() =>
            setValues((v) => ({
              ...v,
              pomoCount: (v.pomoCount % 8) + 1,
            }))
          }
          type='button'
          className="inline-flex items-center justify-center gap-x-1 py-1 px-2 cursor-pointer"
        >
          <span>{values.pomoCount}</span>
          <Pomo />
        </button>

        <button
          type="submit"
          className="p-0.5 cursor-pointer"
        >
          <SubmitArrow />
        </button>
      </div>
    </form>
  );
};

export default TomodoTaskInput;
