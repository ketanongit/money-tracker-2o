import { NextResponse } from 'next/server';
import { db } from '@/db';
import { budgets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const result = await db.select()
      .from(budgets)
      .where(eq(budgets.monthYear, currentMonth));
    
    return NextResponse.json({ amount: result[0]?.amount || 0 });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const currentMonth = new Date().toISOString().slice(0, 7);

    // First try to update existing record
    const result = await db
      .update(budgets)
      .set({ 
        amount,
        updatedAt: new Date()
      })
      .where(eq(budgets.monthYear, currentMonth))
      .returning();

    // If no record was updated, insert new one
    if (result.length === 0) {
      await db.insert(budgets)
        .values({
          amount,
          monthYear: currentMonth,
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}
