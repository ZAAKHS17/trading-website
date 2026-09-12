import TradeForm from "@/components/TradeForm";

export default function NewTradePage() {
  return (
    <div className="container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New trade</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Log a trade to your journal
        </p>
      </header>
      <TradeForm />
    </div>
  );
}
