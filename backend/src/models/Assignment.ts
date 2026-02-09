import pool from '../lib/db';

export interface Assignment {
  id?: number;
  course_id: number;
  title: string;
  description?: string;
  due_date: Date;
  max_points: number;
  type: 'homework' | 'quiz' | 'exam' | 'project';
  status: 'draft' | 'published' | 'closed';
  created_at?: Date;
  updated_at?: Date;
}

export class AssignmentModel {
  static async create(assignment: Assignment): Promise<Assignment> {
    const result = await pool.query(
      `INSERT INTO assignments (course_id, title, description, due_date, max_points, type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        assignment.course_id,
        assignment.title,
        assignment.description,
        assignment.due_date,
        assignment.max_points,
        assignment.type,
        assignment.status
      ]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Assignment | null> {
    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByCourse(courseId: number): Promise<Assignment[]> {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE course_id = $1 ORDER BY due_date ASC',
      [courseId]
    );
    return result.rows;
  }

  static async findAll(limit = 100, offset = 0): Promise<Assignment[]> {
    const result = await pool.query(
      'SELECT a.*, c.name as course_name FROM assignments a JOIN courses c ON a.course_id = c.id LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async update(id: number, assignment: Partial<Assignment>): Promise<Assignment | null> {
    // Whitelist of allowed update fields for security
    const allowedFields = ['title', 'description', 'due_date', 'max_points', 'type', 'status'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(assignment)) {
      if (value !== undefined && key !== 'id' && allowedFields.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE assignments SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
