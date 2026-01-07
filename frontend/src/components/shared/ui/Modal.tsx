import type { MouseEventHandler } from "react";

type ModalProps = React.PropsWithChildren<{
  open: boolean;
  onBackdropClick?: () => void;
  backdropClassName?: string;
  contentClassName?: string;
}>;

export function Modal({
  open,
  children,
  onBackdropClick,
  backdropClassName,
  contentClassName,
}: ModalProps) {
  if (!open) return null;

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onBackdropClick?.();
    }
  };

  return (
    <div className={backdropClassName} onMouseDown={onMouseDown}>
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
