import { Divider, Wrap } from "@chakra-ui/react";
import { TooltipProvider } from "~/Tooltip";
import type { EditorComponent } from "../types";
import BlockQuote from "./BlockQuote";
import Bold from "./Bold";
import Code from "./Code";
import CodeBlock from "./CodeBlock";
import { HeadingOne, HeadingThree, HeadingTwo } from "./Heading";
import HorizontalRule from "./HorizontalRule";
import Italic from "./Italic";
import OrderedList from "./OrderedList";
import Paragraph from "./Paragraph";
import Strike from "./Strike";
import UnorderedList from "./UnorderedList";

const Toolbar: EditorComponent = ({ editor }) => {
  return (
    <TooltipProvider>
      <div className="w-full border-b border-border p-2">
        <Wrap shouldWrapChildren>
          <Paragraph editor={editor} />
          <HeadingOne editor={editor} />
          <HeadingTwo editor={editor} />
          <HeadingThree editor={editor} />
          <Divider orientation="vertical" />

          {/* Inline styles */}
          <Bold editor={editor} />
          <Italic editor={editor} />
          <Strike editor={editor} />
          <Code editor={editor} />
          <Divider orientation="vertical" />

          {/* Block styles */}
          <UnorderedList editor={editor} />
          <OrderedList editor={editor} />
          <CodeBlock editor={editor} />
          <BlockQuote editor={editor} />
          <HorizontalRule editor={editor} />
        </Wrap>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
