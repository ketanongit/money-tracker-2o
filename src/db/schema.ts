import { pgTable } from "drizzle-orm/pg-core";
import { decimal, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum('transaction_type', ['CREDIT', 'DEBIT']);

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  fromAccount: varchar("from_account"),
  toAccount: varchar("to_account"),
  transactionDate: timestamp("transaction_date").notNull(),
});
