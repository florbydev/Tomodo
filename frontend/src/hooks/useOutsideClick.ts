import { useEffect, type RefObject } from "react";

export default function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onOutsideClick: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref as RefObject<HTMLElement>) {
        if (!ref.current) return;
        const element = event.target as HTMLElement;
        if (!ref.current.contains(element) && open) {
          onOutsideClick();
        }
      }
    }

    if (open) {
      document.addEventListener("mouseup", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref, open, onOutsideClick]);
}
