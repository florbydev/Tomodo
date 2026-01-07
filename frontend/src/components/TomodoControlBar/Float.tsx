import Menu from "@/svgs/Menu"

type Props = {
  value: number;
}

const Float = ({ value }: Props) => {
  return (
    <div className="relative inline-flex">
      {value > 0 && <div className="absolute flex items-center justify-center -right-2 -top-2 rounded-full bg-primary border border-outline p-0.5 w-4.5 h-4.5">
        <span className=" text-xs font-medium">{value}</span>
      </div>}
      <Menu />
    </div>
  )
}

export default Float