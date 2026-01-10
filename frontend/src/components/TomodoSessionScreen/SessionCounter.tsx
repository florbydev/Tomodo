type Props = {
  counterValue: string;
}

const SessionCounter = ({ counterValue }: Props) => {
  return (
    <div className="flex items-end gap-x-2">
      <p className="text-9xl font-extralight text-outline">
        {counterValue}
      </p>
    </div>
  )
}

export default SessionCounter
