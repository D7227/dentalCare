import { db } from '../../database/db';
import { attendance } from './attendenceSchema';
import { eq, and, isNull } from 'drizzle-orm';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

// POST /api/attendance/checkin
export async function checkIn(req: Request, res: Response) {
  try {
    const { tech_id } = req.body;
    if (!tech_id) return res.status(400).json({ error: 'tech_id is required' });
    const now = new Date();
    const formattedInTime = dayjs(now).format('hh:mm A');
    const [row] = await db.insert(attendance).values({ techId: tech_id, inTime: formattedInTime }).returning();
    return res.status(201).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}

// POST /api/attendance/checkout
export async function checkOut(req: Request, res: Response) {
  try {
    const { tech_id } = req.body;
    if (!tech_id) return res.status(400).json({ error: 'tech_id is required' });
    // Find today's check-in for this tech_id with no out_time
    const [row] = await db.select().from(attendance)
      .where(and(
        eq(attendance.techId, tech_id),
        isNull(attendance.outTime)
      ));
    if (!row) return res.status(404).json({ error: 'No check-in found for today' });
    const outTime = new Date();
    const formattedOutTime = dayjs(outTime).format('hh:mm A');
    // Use today's date for both times to ensure correct diff
    const today = dayjs().format('YYYY-MM-DD');
    const inTimeObj = dayjs(`${today} ${row.inTime}`, 'YYYY-MM-DD hh:mm A');
    const outTimeObj = dayjs(`${today} ${formattedOutTime}`, 'YYYY-MM-DD hh:mm A');
    let diffMin = outTimeObj.diff(inTimeObj, 'minute');
    let totalHours = '';
    if (isNaN(diffMin) || diffMin < 0) {
      totalHours = '0 min';
    } else if (diffMin < 60) {
      totalHours = `${diffMin} min`;
    } else {
      const hours = Math.floor(diffMin / 60);
      const mins = diffMin % 60;
      totalHours = mins === 0 ? `${hours} hour` : `${hours} hour ${mins} min`;
    }
    const [updated] = await db.update(attendance)
      .set({ outTime: formattedOutTime, totalHours })
      .where(eq(attendance.id, row.id))
      .returning();
    return res.status(200).json(updated);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
