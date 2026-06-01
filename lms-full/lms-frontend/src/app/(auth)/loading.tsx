import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <section className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* 🔥 Spinner */}
        <Loader2 className="text-primary h-10 w-10 animate-spin" />

        {/* 🔥 Text */}
        <p className="text-muted-foreground text-sm">Loading, please wait...</p>
      </div>
    </section>
  );
}
