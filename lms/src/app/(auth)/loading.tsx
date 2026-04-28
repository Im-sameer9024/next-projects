import { Loader2 } from "lucide-react";

export default function Loading() {
  setTimeout(() => {
    new Promise((resolve) => resolve);
  }, 3000);

  return (
    <section className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* 🔥 Spinner  */}
        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        {/* 🔥 Text */}
        <p className="text-sm text-muted-foreground">Loading, please wait...</p>
      </div>
    </section>
  );
}
