import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconTransfer,
  IconFileText,
  IconTerminal2,
} from "@tabler/icons-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "File Transfer",
      icon: (
        <IconTransfer className="h-full w-full text-green-400 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "Code Snippets",
      icon: (
        <IconTerminal2 className="h-full w-full text-green-400 dark:text-neutral-300" />
      ),
      href: "code-snippets",
    },
    {
      title: "Text File",
      icon: (
        <IconFileText className="h-full w-full text-green-400 dark:text-neutral-300" />
      ),
      href: "txt-share",
    },
  ];
  return (
    <div className="flex items-center justify-center  ">
      <FloatingDock
        mobileClassName="translate-y-20" 
        items={links}
      />
    </div>
  );
}