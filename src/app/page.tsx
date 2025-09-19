import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <h1 className="text-3xl font-bold text-red-500">Hello, Next.js!</h1>
      <Button>Click me</Button>
    </div>
  );
}
