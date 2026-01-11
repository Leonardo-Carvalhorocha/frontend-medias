import { useEffect, useState } from "react";

export default function GlobalError() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      setMessage(customEvent.detail.message);

      setTimeout(() => setMessage(null), 6000);
    };

    window.addEventListener("global-error", handler);
    return () => window.removeEventListener("global-error", handler);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
        {message}
      </div>
    </div>
  );
}
