"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TradeForm from "@/components/TradeForm";

export default function EditTradePage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/trades/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Trade not found");
        return r.json();
      })
      .then((data) => {
        const t = data.trade;
        setInitial({
          tradingAccountId: t.tradingAccountId,
          strategyId: t.strategyId,
          date: t.date,
          time: t.time,
          symbol: t.symbol,
          assetType: t.assetType,
          direction: t.direction,
          entryPrice: t.entryPrice,
          stopLoss: t.stopLoss,
          takeProfit: t.takeProfit,
          exitPrice: t.exitPrice,
          positionSize: t.positionSize,
          riskAmount: t.riskAmount,
          profitLoss: t.profitLoss,
          fees: t.fees,
          riskReward: t.riskReward,
          session: t.session,
          result: t.result,
          notes: t.notes,
          mistakes: t.mistakes,
          lessons: t.lessons,
          confidenceLevel: t.confidenceLevel,
          tagIds: (t.tradeTags || []).map((x: { tagId: string }) => x.tagId),
        });
      })
      .catch((e) => setError(e.message));
  }, [params.id]);

  if (error) return <p className="text-rose-600">{error}</p>;
  if (!initial) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Edit trade</h1>
      </header>
      <TradeForm tradeId={params.id} initial={initial as never} />
    </div>
  );
}
