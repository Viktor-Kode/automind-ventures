export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} AutoMind Ventures. All rights reserved.</p>
        <p className="text-[11px]">
          Built for seamless connections between vehicle owners and technicians.
        </p>
      </div>
    </footer>
  );
}

