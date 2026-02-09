import pool from '../lib/db';

export interface Enrollment {
  id?: number;
  student_id: number;
  course_id: number;
  enrollment_date: Date;
  status: 'enrolled' | 'completed' | 'dropped' | 'failed';
  grade?: number;
  final_score?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class EnrollmentModel {
  static async create(enrollment: Enrollment): Promise<Enrollment> {
    const result = await pool.query(
      `INSERT INTO enrollments (student_id, course_id, enrollment_date, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [enrollment.student_id, enrollment.course_id, enrollment.enrollment_date, enrollment.status]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Enrollment | null> {
    const result = await pool.query('SELECT * FROM enrollments WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByStudentAndCourse(studentId: number, courseId: number): Promise<Enrollment | null> {
    const result = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, courseId]
    );
    return result.rows[0] || null;
  }

  static async findByStudent(studentId: number): Promise<Enrollment[]> {
    const result = await pool.query(`
      SELECT e.*, c.name as course_name, c.code as course_code
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = $1
    `, [studentId]);
    return result.rows;
  }

  static async findByCourse(courseId: number): Promise<Enrollment[]> {
    const result = await pool.query(`
      SELECT e.*, u.first_name, u.last_name, s.student_number
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE e.course_id = $1
    `, [courseId]);
    return result.rows;
  }

  static async update(id: number, enrollment: Partial<Enrollment>): Promise<Enrollment | null> {
    // Whitelist of allowed update fields for security
    const allowedFields = ['enrollment_date', 'status', 'grade', 'final_score'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(enrollment)) {
      if (value !== undefined && key !== 'id' && allowedFields.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE enrollments SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM enrollments WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
