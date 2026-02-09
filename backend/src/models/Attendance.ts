import pool from '../lib/db';

export interface Attendance {
  id?: number;
  student_id: number;
  course_id: number;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class AttendanceModel {
  static async create(attendance: Attendance): Promise<Attendance> {
    const result = await pool.query(
      `INSERT INTO attendance (student_id, course_id, date, status, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [attendance.student_id, attendance.course_id, attendance.date, attendance.status, attendance.notes]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Attendance | null> {
    const result = await pool.query('SELECT * FROM attendance WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByStudentAndCourse(studentId: number, courseId: number): Promise<Attendance[]> {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE student_id = $1 AND course_id = $2 ORDER BY date DESC',
      [studentId, courseId]
    );
    return result.rows;
  }

  static async findByCourseAndDate(courseId: number, date: Date): Promise<Attendance[]> {
    const result = await pool.query(
      `SELECT a.*, u.first_name, u.last_name, s.student_number
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE a.course_id = $1 AND a.date = $2`,
      [courseId, date]
    );
    return result.rows;
  }

  static async update(id: number, attendance: Partial<Attendance>): Promise<Attendance | null> {
    // Whitelist of allowed update fields for security
    const allowedFields = ['date', 'status', 'notes'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(attendance)) {
      if (value !== undefined && key !== 'id' && allowedFields.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE attendance SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM attendance WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
