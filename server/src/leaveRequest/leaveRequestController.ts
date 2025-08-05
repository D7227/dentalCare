import { db } from '../../database/db';
import { leaveRequest } from './leaveRequestSchema';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

// POST /api/leave-request (create leave request)
export async function createLeaveRequest(req: Request, res: Response) {
  try {
    const { tech_id, leave_type, leave_date, leave_time, reason} = req.body;
    if (!tech_id || !leave_type || !leave_date || !leave_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [row] = await db.insert(leaveRequest).values({
      techId: tech_id,
      leaveType: leave_type,
      leaveDate: leave_date,
      leaveTime: leave_time,
      reason,
    }).returning();
    return res.status(201).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}

// PATCH /api/leave-request/:id/status (update leave status)
export async function updateLeaveStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { leave_status } = req.body;
    if (!leave_status) return res.status(400).json({ error: 'leave_status is required' });
    const [row] = await db.update(leaveRequest)
      .set({ leaveStatus: leave_status })
      .where(eq(leaveRequest.id, id))
      .returning();
    if (!row) return res.status(404).json({ error: 'Leave request not found' });
    return res.status(200).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}

// GET /api/leave-request (get all leave requests)
export async function getAllLeaveRequests(req: Request, res: Response) {
  try {
    const rows = await db.select().from(leaveRequest);
    return res.status(200).json(rows);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}

// GET /api/leave-request/:id (get one leave request by id)
export async function getLeaveRequestById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [row] = await db.select().from(leaveRequest).where(eq(leaveRequest.id, id));
    if (!row) return res.status(404).json({ error: 'Leave request not found' });
    return res.status(200).json(row);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
}
