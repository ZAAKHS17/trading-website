import { PrismaClient, AccountType, AssetType, TradeDirection, TradeResult, TradingSession } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.create({
    data: {
      name: 'Demo Trader',
      email: 'demo@example.com',
      password: 'demo-password',
      timezone: 'UTC',
      currency: 'USD',
      defaultRisk: 1.0,
    },
  });

  const account = await prisma.tradingAccount.create({
    data: {
      userId: user.id,
      name: 'Demo Account',
      broker: 'DemoBroker',
      startingBalance: 10000,
      currentBalance: 10000,
      accountSize: 10000,
      accountType: AccountType.CASH,
      currency: 'USD',
    },
  });

  const strategy1 = await prisma.strategy.create({
    data: {
      userId: user.id,
      name: 'Breakout',
      description: 'Breakout strategy focusing on momentum after consolidation',
    },
  });

  const strategy2 = await prisma.strategy.create({
    data: {
      userId: user.id,
      name: 'Mean Reversion',
      description: 'Fade moves that look overextended',
    },
  });

  const tags = [];
  const tagNames = ['overnight', 'news', 'swing', 'scalp', 'high-impact'];
  for (const t of tagNames) {
    const tag = await prisma.tag.create({ data: { userId: user.id, name: t } });
    tags.push(tag);
  }

  // Create a few sample trades
  const trade1 = await prisma.trade.create({
    data: {
      userId: user.id,
      tradingAccountId: account.id,
      strategyId: strategy1.id,
      date: new Date('2023-08-01T00:00:00.000Z'),
      time: '14:35',
      symbol: 'AAPL',
      assetType: AssetType.STOCK,
      direction: TradeDirection.LONG,
      entryPrice: 175.25,
      stopLoss: 172.50,
      takeProfit: 180.00,
      exitPrice: 179.10,
      positionSize: 57.1,
      riskAmount: 156.75,
      profitLoss: 275.85,
      fees: 1.50,
      riskReward: 1.76,
      session: TradingSession.NEW_YORK,
      result: TradeResult.WIN,
      notes: 'Entered on breakout after strong volume',
      confidenceLevel: 8,
      tradeTags: {
        create: [
          { tag: { connect: { id: tags[0].id } } },
          { tag: { connect: { id: tags[1].id } } },
        ],
      },
    },
  });

  const trade2 = await prisma.trade.create({
    data: {
      userId: user.id,
      tradingAccountId: account.id,
      strategyId: strategy2.id,
      date: new Date('2023-08-02T00:00:00.000Z'),
      time: '09:15',
      symbol: 'EURUSD',
      assetType: AssetType.FOREX,
      direction: TradeDirection.SHORT,
      entryPrice: 1.1025,
      stopLoss: 1.1060,
      takeProfit: 1.0950,
      exitPrice: 1.0950,
      positionSize: 100000,
      riskAmount: 350.00,
      profitLoss: 750.00,
      fees: 2.00,
      riskReward: 2.14,
      session: TradingSession.LONDON,
      result: TradeResult.WIN,
      notes: 'Mean reversion after spike',
      confidenceLevel: 7,
      tradeTags: {
        create: [
          { tag: { connect: { id: tags[2].id } } },
        ],
      },
    },
  });

  const trade3 = await prisma.trade.create({
    data: {
      userId: user.id,
      tradingAccountId: account.id,
      strategyId: strategy1.id,
      date: new Date('2023-08-03T00:00:00.000Z'),
      time: '22:10',
      symbol: 'BTCUSD',
      assetType: AssetType.CRYPTO,
      direction: TradeDirection.LONG,
      entryPrice: 29000,
      stopLoss: 28500,
      takeProfit: 30500,
      exitPrice: 28500,
      positionSize: 0.5,
      riskAmount: 250.00,
      profitLoss: -500.00,
      fees: 5.00,
      riskReward: 0.5,
      session: TradingSession.ASIA,
      result: TradeResult.LOSS,
      notes: 'Overnight volatility; got stopped out',
      mistakes: 'Did not adjust sizing for high volatility',
      lessons: 'Reduce size for crypto overnight',
      confidenceLevel: 5,
      tradeTags: {
        create: [
          { tag: { connect: { id: tags[3].id } } },
          { tag: { connect: { id: tags[4].id } } },
        ],
      },
    },
  });

  const daily = await prisma.dailyJournal.create({
    data: {
      userId: user.id,
      date: new Date('2023-08-03T00:00:00.000Z'),
      notes: 'Good review of trades. Need to tighten sizing for high-volatility assets.',
      mistakes: 'Sizing too large on crypto overnight',
      lessons: 'Cut position size and set wider stops or avoid overnight',
      disciplineScore: 7,
      emotion: 'Frustrated',
    },
  });

  console.log('Seeding finished.');
  console.log({ user, account, strategy1, strategy2, tagsCount: tags.length, tradeCount: 3, dailyId: daily.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
