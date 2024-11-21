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
      icon: <IconTransfer className="h-6 w-6 text-green-400 dark:text-neutral-300" />,
      href: "/",
    },
    {
      title: "Code Snippets",
      icon: <IconTerminal2 className="h-6 w-6 text-green-400 dark:text-neutral-300" />,
      href: "code-snippets",
    },
    {
      title: "Text File",
      icon: <IconFileText className="h-6 w-6 text-green-400 dark:text-neutral-300" />,
      href: "txt-share",
    },
  ];

  const renderFloatingDock = () => (
    <div className="hidden sm:flex items-center justify-center">
      <FloatingDock
        mobileClassName="translate-y-20"
        items={links}
      />
    </div>
  );

  const renderTabs = () => (
    <div className="sm:hidden flex justify-around border-t bg-neutral-900 fixed bottom-0 left-0 right-0 rounded-t-2xl z-50">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="flex flex-col items-center justify-center p-2 hover:bg-neutral-800 hover:rounded-2xl"
        >
          {link.icon}
          <span className="text-xs text-neutral-300">{link.title}</span>
        </a>
      ))}
    </div>
  );

  return (
    <>
      {renderFloatingDock()}
      {renderTabs()}
    </>
  );
}
