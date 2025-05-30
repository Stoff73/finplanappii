-- Migration: Add Goal-Specific Tables and Fields
-- This migration adds the new tables and columns needed for goal-specific financial planning

-- Create UserGoal table to track active goals
CREATE TABLE IF NOT EXISTS "user_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "goalLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "completionScore" INTEGER NOT NULL DEFAULT 0,
    "isCurrentGoal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "user_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create GoalProgress table to track progress for specific goal areas
CREATE TABLE IF NOT EXISTS "goal_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "userGoalId" TEXT NOT NULL,
    "progressType" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "goal_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "goal_progress_userGoalId_fkey" FOREIGN KEY ("userGoalId") REFERENCES "user_goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add unique constraint for goal progress
CREATE UNIQUE INDEX IF NOT EXISTS "goal_progress_userGoalId_progressType_key" ON "goal_progress"("userGoalId", "progressType");

-- Add goalId column to existing tables to associate data with specific goals
ALTER TABLE "messages" ADD COLUMN "goalId" TEXT;
ALTER TABLE "goals" ADD COLUMN "goalId" TEXT;
ALTER TABLE "income" ADD COLUMN "goalId" TEXT;
ALTER TABLE "expenses" ADD COLUMN "goalId" TEXT;
ALTER TABLE "assets" ADD COLUMN "goalId" TEXT;
ALTER TABLE "debts" ADD COLUMN "goalId" TEXT;
ALTER TABLE "risk_profiles" ADD COLUMN "goalId" TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "user_goals_userId_idx" ON "user_goals"("userId");
CREATE INDEX IF NOT EXISTS "user_goals_goalType_idx" ON "user_goals"("goalType");
CREATE INDEX IF NOT EXISTS "user_goals_isCurrentGoal_idx" ON "user_goals"("isCurrentGoal");
CREATE INDEX IF NOT EXISTS "goal_progress_userId_idx" ON "goal_progress"("userId");
CREATE INDEX IF NOT EXISTS "goal_progress_userGoalId_idx" ON "goal_progress"("userGoalId");

-- Create indexes for goalId foreign keys
CREATE INDEX IF NOT EXISTS "messages_goalId_idx" ON "messages"("goalId");
CREATE INDEX IF NOT EXISTS "goals_goalId_idx" ON "goals"("goalId");
CREATE INDEX IF NOT EXISTS "income_goalId_idx" ON "income"("goalId");
CREATE INDEX IF NOT EXISTS "expenses_goalId_idx" ON "expenses"("goalId");
CREATE INDEX IF NOT EXISTS "assets_goalId_idx" ON "assets"("goalId");
CREATE INDEX IF NOT EXISTS "debts_goalId_idx" ON "debts"("goalId");
CREATE INDEX IF NOT EXISTS "risk_profiles_goalId_idx" ON "risk_profiles"("goalId");