import React from "react";

type IconButtonVariant = "solid" | "outline" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

const iconSizeMap: Record<IconButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export type IconButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    children: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  };

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>(({ children, variant = "solid", size = "md", className, ...buttonProps }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      data-variant={variant}
      data-size={size}
      className={className}
      {...buttonProps}
    >
      {React.cloneElement(children, {
        width: iconSizeMap[size],
        height: iconSizeMap[size],
        "aria-hidden": true,
        focusable: false,
      })}
    </button>
  );
});

IconButton.displayName = "IconButton";
export default IconButton;
