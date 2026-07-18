'use client';

import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface ToolBadgeProps {
  toolSlug: string;
  toolName: string;
  toolNameEn: string;
}

export function ToolBadge({ toolSlug, toolName, toolNameEn }: ToolBadgeProps) {
  const [copied, setCopied] = useState(false);
  const badgeCode = `<a href="https://korelyy.com/en/tool/${toolSlug}/" target="_blank" rel="noopener noreferrer"><img src="https://korelyy.com/badge/${toolSlug}" alt="${toolNameEn} - Free Online Tool" style="border:none;vertical-align:middle;" /></a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(badgeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Embed Badge</h3>
        <Code2 className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
          {toolNameEn}
        </div>
        <span className="text-xs text-gray-500">via Korelyy</span>
      </div>
      
      <div className="relative">
        <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 overflow-x-auto border border-gray-200">
          {badgeCode}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mt-3">
        Add this badge to your website or blog to link to this tool and help us grow!
      </p>
    </div>
  );
}

export function BadgeGeneratorPage() {
  const [selectedTool, setSelectedTool] = useState('');
  const [copied, setCopied] = useState(false);
  
  const tools = [
    { slug: 'regex-tester', name: 'Regex Tester', nameEn: 'Regex Tester' },
    { slug: 'emoji-mixer', name: 'Emoji Mixer', nameEn: 'Emoji Mixer' },
    { slug: 'password-generator', name: 'Password Generator', nameEn: 'Password Generator' },
    { slug: 'qr-code-generator', name: 'QR Code Generator', nameEn: 'QR Code Generator' },
    { slug: 'json-formatter', name: 'JSON Formatter', nameEn: 'JSON Formatter' },
    { slug: 'base64-tool', name: 'Base64 Tool', nameEn: 'Base64 Tool' },
  ];

  const generateCode = () => {
    const tool = tools.find(t => t.slug === selectedTool);
    if (!tool) return '';
    return `<a href="https://korelyy.com/en/tool/${tool.slug}/" target="_blank" rel="noopener noreferrer"><img src="https://korelyy.com/badge/${tool.slug}" alt="${tool.nameEn} - Free Online Tool" style="border:none;vertical-align:middle;" /></a>`;
  };

  const handleCopy = () => {
    const code = generateCode();
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Korelyy Tool Badges</h1>
          <p className="text-gray-500">Generate embed badges for your favorite Korelyy tools</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Tool</label>
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Choose a tool...</option>
            {tools.map(tool => (
              <option key={tool.slug} value={tool.slug}>{tool.nameEn}</option>
            ))}
          </select>
        </div>
        
        {selectedTool && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {tools.find(t => t.slug === selectedTool)?.nameEn}
                  </div>
                  <span className="text-sm text-gray-500">via Korelyy</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                  {generateCode()}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Why embed our badges?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Help your visitors discover useful tools</li>
                <li>• Earn backlinks from Korelyy</li>
                <li>• Boost your website's SEO</li>
                <li>• Show your support for free tools</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
