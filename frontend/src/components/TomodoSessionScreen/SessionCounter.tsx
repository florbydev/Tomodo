import classNames from 'classnames'

const MAX_SESSIONS = 4

type Props = {
  counterValue: string;
}

const SessionCounter = ({ counterValue }: Props) => {

  const sessionCount = 2;

  return (
    <div className="flex items-end gap-x-2">
      <p className="text-8xl font-semibold text-outline">
        {counterValue}
      </p>

      <div className="flex gap-x-1 mb-3">
        {Array.from({ length: MAX_SESSIONS }).map((_, index) => {

          const pillClass = classNames('h-6 w-2 border rounded-full', {
            'bg-primary': index < sessionCount,
          })
          return <div
            key={index}
            className={pillClass}
          />
        })}
      </div>
    </div>
  )
}

export default SessionCounter
