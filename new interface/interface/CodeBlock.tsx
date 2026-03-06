import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language = 'yaml',
  filename,
  showLineNumbers = false,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  // Simple syntax highlighting for YAML/config files
  const highlightSyntax = (line: string, lineNumber: number) => {
    const isHighlighted = highlightLines.includes(lineNumber);
    const baseClass = isHighlighted ? 'bg-cyan-500/10' : '';

    // Comments
    if (line.trim().startsWith('#')) {
      return (
        <span className={`text-gray-500 ${baseClass}`}>{line}</span>
      );
    }

    // Keys (before colon)
    const parts = line.split(':');
    if (parts.length > 1) {
      return (
        <span className={baseClass}>
          <span className="text-purple-400">{parts[0]}:</span>
          <span className="text-gray-300">{parts.slice(1).join(':')}</span>
        </span>
      );
    }

    // Strings in quotes
    if (line.includes("'") || line.includes('"')) {
      return (
        <span className={`text-green-400 ${baseClass}`}>{line}</span>
      );
    }

    // Lists (starting with -)
    if (line.trim().startsWith('-')) {
      return (
        <span className={baseClass}>
          <span className="text-cyan-400">-</span>
          <span className="text-gray-300">{line.substring(line.indexOf('-') + 1)}</span>
        </span>
      );
    }

    return <span className={baseClass}>{line}</span>;
  };

  return (
    <div className="group bg-[#1a1f3a] rounded-lg border border-gray-700 overflow-hidden
                    hover:border-gray-600 transition-colors duration-300">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0a0e27] border-b border-gray-700 
                      flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Traffic lights (macOS style) */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/30 
                            group-hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/30 
                            group-hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/30 
                            group-hover:bg-green-500 transition-colors" />
          </div>

          {/* Filename */}
          {filename && (
            <span className="text-gray-400 text-sm font-mono">{filename}</span>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded
                     text-sm font-medium
                     text-cyan-400 hover:text-cyan-300
                     hover:bg-cyan-500/10
                     transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copié!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono">
            {lines.map((line, index) => (
              <div
                key={index}
                className="min-h-[1.5rem] hover:bg-white/5 transition-colors"
              >
                {showLineNumbers && (
                  <span className="inline-block w-12 text-gray-600 select-none text-right pr-4">
                    {index + 1}
                  </span>
                )}
                {highlightSyntax(line, index + 1)}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Multi-tab code block
interface CodeTab {
  label: string;
  language: string;
  code: string;
  filename?: string;
}

interface TabbedCodeBlockProps {
  tabs: CodeTab[];
}

export function TabbedCodeBlock({ tabs }: TabbedCodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-[#1a1f3a] rounded-lg border border-gray-700 overflow-hidden">
      {/* Tab headers */}
      <div className="flex gap-1 px-4 pt-4 bg-[#0a0e27] border-b border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all
                        ${
                          activeTab === index
                            ? 'bg-[#1a1f3a] text-cyan-400 border-t border-x border-gray-700'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <CodeBlock
        code={tabs[activeTab].code}
        language={tabs[activeTab].language}
        filename={tabs[activeTab].filename}
        showLineNumbers
      />
    </div>
  );
}

// Example usage
export function ExampleCodeBlocks() {
  const yamlCode = `on_http_request:
  # send requests with the /api path prefix to the api service
  - expressions:
      # conditions are CEL expressions, see https://cel.dev
      - req.url.path.startsWith('/api')
    actions:
      - type: forward-internal
        config:
          url: https://api.internal

# route dynamically based on a header using CEL interpolation
  - actions:
      - type: forward-internal
        config:
          url: https://\${req.headers('X-Custom-Header')}.internal`;

  const tabs: CodeTab[] = [
    {
      label: 'YAML',
      language: 'yaml',
      code: yamlCode,
      filename: 'config.yaml',
    },
    {
      label: 'JSON',
      language: 'json',
      code: JSON.stringify({ config: 'example' }, null, 2),
      filename: 'config.json',
    },
  ];

  return (
    <div className="space-y-8 p-8 bg-[#0a0e27]">
      <CodeBlock
        code={yamlCode}
        language="yaml"
        filename="ngrok.yml"
        showLineNumbers
        highlightLines={[5, 11]}
      />

      <TabbedCodeBlock tabs={tabs} />
    </div>
  );
}
