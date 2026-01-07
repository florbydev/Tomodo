/* eslint-disable react-refresh/only-export-components */
import type { ProjectType } from "@/components/types";
import useOutsideClick from "@/hooks/useOutsideClick";
import Filter from "@/svgs/Filter";
import { createContext, useRef, useState } from "react";
import { GoBriefcase } from "react-icons/go";
import { MdArrowDropDown, MdKeyboardArrowDown, MdOutlineFilter } from "react-icons/md";

type RootProps = {
  children?: React.ReactNode;
  projectList: Array<ProjectType>;
  value: ProjectType;
  onClick: (value: ProjectType) => void;
  style: {
    triggerStyle: string;
    contentStyle: string;
  }
}

type DropdownType = {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  selectedValue: ProjectType | undefined;
  setSelectedValue: (value: ProjectType) => void
  projectList: Array<ProjectType>;
}

export const DropdownContext = createContext<DropdownType | undefined>(undefined);

const Dropdown = ({ projectList, value, onClick }: RootProps) => {
  const [open, setIsOpen] = useState(false);
  const divRef = useRef(null);

  useOutsideClick(divRef, open, () => {
    setIsOpen(false);
  })

  return (
    <div ref={divRef} className="relative">
      <button type='button' className="flex items-center justify-center gap-x-1.5 cursor-pointer rounded-full px-2 py-1" onClick={() => setIsOpen(!open)}>
        <Filter />
        <p className="font-medium text-xs">{value?.name || "General"}</p>
        <MdKeyboardArrowDown />
      </button>
      {open && <div className="absolute top-6 border border-black flex flex-col items-start px-2 py-1.5 bg-white rounded-md">
        {projectList.map(projectItem => {
          return <button
            className="whitespace-nowrap"
            onClick={() => {
              onClick(projectItem);
              setIsOpen(false);
            }}
          >
            {projectItem.name}
          </button>
        })}
      </div >}
    </div>
  )
}

export default Dropdown;