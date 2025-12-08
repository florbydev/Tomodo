
type TextTag = "p" | "span";

type TextProps = {
  as?: TextTag;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const Text = ({ as: Tag = "p", children, ...props }: TextProps) => {
  return <Tag {...props}>{children}</Tag>;
};

export default Text;
