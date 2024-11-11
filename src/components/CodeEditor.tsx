'use client'

import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { rust } from '@codemirror/lang-rust'
import { go } from '@codemirror/lang-go'
import { php } from '@codemirror/lang-php'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon, Sun } from 'lucide-react'

export default function CodeEditor() {
  const [code, setCode] = useState("console.log('Hello, World!');")
  const [language, setLanguage] = useState('javascript')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const handleCodeChange = React.useCallback((value: string) => {
    setCode(value)
  }, [])

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    // Set default code for the selected language
    const defaultCode = {
      javascript: "console.log('Hello, World!');",
      python: "print('Hello, World!')",
      java: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
      cpp: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}",
      rust: "fn main() {\n    println!(\"Hello, World!\");\n}",
      go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}",
      csharp: "using System;\n\nclass Program {\n    static void Main(string[] args) {\n        Console.WriteLine(\"Hello, World!\");\n    }\n}",
      php: "<?php\necho \"Hello, World!\";\n?>",
      ruby: "puts 'Hello, World!'",
      swift: "print(\"Hello, World!\")"
    }[value]
    setCode(defaultCode || "// Start coding here")
  }

  const getLanguageMode = () => {
    const modes = {
      javascript: javascript({ jsx: true }),
      python: python(),
      java: java(),
      cpp: cpp(),
      rust: rust(),
      go: go(),
      php: php(),
    }
    return modes[language as keyof typeof modes] || javascript({ jsx: true })
  }

  return (
    <div className={`w-full transition-colors duration-200 ease-in-out bg-black text-white`}>
      <div className="w-full max-w-8xl space-y-4">
        <div className="flex justify-between items-center">
          <Select onValueChange={handleLanguageChange} value={language}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
              <SelectItem value="ruby">Ruby</SelectItem>
              <SelectItem value="swift">Swift</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4" />
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl">
          <CodeMirror
            value={code}
            height="500px"
            theme={isDarkMode ? vscodeDark : undefined}
            extensions={[getLanguageMode()]}
            onChange={handleCodeChange}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  )
}