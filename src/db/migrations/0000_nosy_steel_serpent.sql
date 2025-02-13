CREATE TABLE "transactions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"type" varchar NOT NULL,
	"from_account" varchar,
	"to_account" varchar,
	"transaction_date" timestamp NOT NULL
);
