// Checkmark.tsx
import Check from "@/svgs/Check"
import classNames from "classnames"

type Props = {
  checked: boolean
  onToggle?: () => void
  ariaLabel?: string
}

export default function Checkmark({
  checked,
  onToggle,
  ariaLabel = "Toggle task completion",
}: Props) {
  const buttonClass = classNames(
    "w-4.5 h-4.5 rounded-md border border-outline flex items-center justify-center shrink-0",
    {
      "bg-primary": checked,
      "bg-white": !checked,
    }
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      onToggle?.()
    }
  }

  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={0}
      className={buttonClass}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
    >
      {checked && <Check />}
    </span>
  )
}
