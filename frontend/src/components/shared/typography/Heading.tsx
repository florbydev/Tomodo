
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  as?: HeadingTag;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const Heading = ({ as: Tag = "h2", children, ...props }: HeadingProps) => {
  return <Tag {...props}>{children}</Tag>;
};

export default Heading;
