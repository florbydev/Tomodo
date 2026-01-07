import { useState, useCallback, useEffect } from "react";

type UseModalOptions = {
  /**
   * @description Modal closes when the Esc key is pressed.
   */
  closeOnEsc?: boolean;
};

export function useModal(options: UseModalOptions = {}) {
  const { closeOnEsc = true } = options;

  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen(v => !v), []);

  // Escape handling
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc]);

  return { open, show, hide, toggle, setOpen } as const;
}
