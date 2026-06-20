import Link from "next/link";
import {
  Minimize2,
  Combine,
  Split,
  FileType,
  FileEdit,
  Shield,
  Zap,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tools = [
  {
    href: "/tools/compress",
    icon: Minimize2,
    title: "Compress PDF",
    desc: "Reduce file size intelligently, supports large blueprint compression",
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/tools/merge",
    icon: Combine,
    title: "Merge PDF",
    desc: "Drag & arrange multiple files, merge into one",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    href: "/tools/split",
    icon: Split,
    title: "Split PDF",
    desc: "Split by page count or range, batch download",
    color: "bg-amber-50 text-amber-600",
  },
  {
    href: "/tools/to-word",
    icon: FileType,
    title: "PDF to Word",
    desc: "Extract text content, generate editable documents",
    color: "bg-purple-50 text-purple-600",
  },
  {
    href: "/tools/rename",
    icon: FileEdit,
    title: "Batch Rename",
    desc: "Drawing numbering, regex rules for batch renaming",
    color: "bg-rose-50 text-rose-600",
  },
];

const features = [
  {
    icon: Shield,
    title: "Local Processing",
    desc: "Files are processed directly in your browser, never uploaded to any server",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "No queue, no waiting - process instantly",
  },
  {
    icon: Lock,
    title: "Privacy & Secure",
    desc: "Your files never leave your device",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Local Processing, Private & Secure
            <span className="text-primary"> PDF Tools</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Compress, Merge, Split, To Word, Batch Rename &mdash; all operations run locally in your browser.
            Zero upload. Zero wait. Zero leakage risk.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/tools/compress">
              <Button size="lg" className="h-12 px-8 text-base">
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Core Tools
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cover all daily PDF processing needs, constantly updated
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block">
                <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex flex-col items-start p-6">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${tool.color}`}
                    >
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tool.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Trust */}
      <section className="border-t bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
