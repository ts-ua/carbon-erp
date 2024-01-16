import { sanitize } from "dompurify";
import { useMemo } from "react";

type HTMLProps = {
  text: string;
};

const HTML = ({ text }: HTMLProps) => {
  const sanitizedHtml = useMemo(() => {
    return { __html: sanitize(text) };
  }, [text]);

  return (
    <div className="[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:text-lg [&_h3]:font-bold [&_h3]:tracking-tight [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-4 [&_ol]:ml-4 [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-auto [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:ml-4 [&_hr]:border-none [&_hr]:border-b-1 [&_hr]:border-gray-200 [&_hr]:my-4">
      <span dangerouslySetInnerHTML={sanitizedHtml} />
    </div>
  );
};

export { HTML };
