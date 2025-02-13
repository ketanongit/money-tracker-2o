import { pgTable, decimal, timestamp, varchar, serial } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull(),
  fromAccount: varchar("from_account"),
  toAccount: varchar("to_account"),
  transactionDate: timestamp("transaction_date").notNull(),
});

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  monthYear: varchar("month_year", { length: 7 }).notNull().unique(), // Added unique constraint
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
