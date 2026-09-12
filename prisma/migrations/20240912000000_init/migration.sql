-- CreateEnum
CREATE TYPE "TradeDirection" AS ENUM ('LONG', 'SHORT');
CREATE TYPE "TradeResult" AS ENUM ('WIN', 'LOSS', 'BREAK_EVEN');
CREATE TYPE "TradingSession" AS ENUM ('ASIA', 'LONDON', 'NEW_YORK', 'PRE_MARKET', 'POST_MARKET', 'OTHER');
CREATE TYPE "AssetType" AS ENUM ('STOCK', 'FOREX', 'CRYPTO', 'FUTURES', 'OPTION', 'ETF', 'OTHER');
CREATE TYPE "AccountType" AS ENUM ('CASH', 'MARGIN', 'PROPFIRM', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "timezone" TEXT,
    "currency" TEXT,
    "defaultRisk" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TradingAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "broker" TEXT,
    "propFirm" TEXT,
    "startingBalance" DOUBLE PRECISION NOT NULL,
    "currentBalance" DOUBLE PRECISION NOT NULL,
    "accountSize" INTEGER,
    "accountType" "AccountType" NOT NULL,
    "currency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TradingAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradingAccountId" TEXT NOT NULL,
    "strategyId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "symbol" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "direction" "TradeDirection" NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "stopLoss" DOUBLE PRECISION,
    "takeProfit" DOUBLE PRECISION,
    "exitPrice" DOUBLE PRECISION,
    "positionSize" DOUBLE PRECISION,
    "riskAmount" DOUBLE PRECISION,
    "profitLoss" DOUBLE PRECISION,
    "fees" DOUBLE PRECISION,
    "riskReward" DOUBLE PRECISION,
    "session" "TradingSession" NOT NULL,
    "result" "TradeResult" NOT NULL,
    "notes" TEXT,
    "mistakes" TEXT,
    "lessons" TEXT,
    "emotionBefore" TEXT,
    "emotionAfter" TEXT,
    "confidenceLevel" INTEGER,
    "screenshotUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TradeTag" (
    "tradeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "TradeTag_pkey" PRIMARY KEY ("tradeId","tagId")
);

CREATE TABLE "DailyJournal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "mistakes" TEXT,
    "lessons" TEXT,
    "disciplineScore" INTEGER,
    "emotion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DailyJournal_pkey" PRIMARY KEY ("id")
);

-- Indexes & uniques
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "TradingAccount_userId_idx" ON "TradingAccount"("userId");
CREATE UNIQUE INDEX "TradingAccount_userId_name_key" ON "TradingAccount"("userId", "name");
CREATE INDEX "Strategy_userId_idx" ON "Strategy"("userId");
CREATE INDEX "Tag_userId_idx" ON "Tag"("userId");
CREATE INDEX "Trade_userId_idx" ON "Trade"("userId");
CREATE INDEX "Trade_tradingAccountId_idx" ON "Trade"("tradingAccountId");
CREATE INDEX "Trade_strategyId_idx" ON "Trade"("strategyId");
CREATE INDEX "TradeTag_tagId_idx" ON "TradeTag"("tagId");
CREATE INDEX "DailyJournal_userId_idx" ON "DailyJournal"("userId");
CREATE INDEX "DailyJournal_date_idx" ON "DailyJournal"("date");

-- FKs
ALTER TABLE "TradingAccount" ADD CONSTRAINT "TradingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_tradingAccountId_fkey" FOREIGN KEY ("tradingAccountId") REFERENCES "TradingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TradeTag" ADD CONSTRAINT "TradeTag_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeTag" ADD CONSTRAINT "TradeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DailyJournal" ADD CONSTRAINT "DailyJournal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
