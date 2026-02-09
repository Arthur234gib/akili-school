import pool from '../lib/db';

export interface Course {
  id?: number;
  code: string;
  name: string;
  description?: string;
  teacher_id: number;
  credits: number;
  level: string;
  subject: string;
  start_date: Date;
  end_date: Date;
  status: 'draft' | 'active' | 'archived';
  max_students?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class CourseModel {
  static async create(course: Course): Promise<Course> {
    const result = await pool.query(
      `INSERT INTO courses (code, name, description, teacher_id, credits, level, subject, 
        start_date, end_date, status, max_students)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        course.code,
        course.name,
        course.description,
        course.teacher_id,
        course.credits,
        course.level,
        course.subject,
        course.start_date,
        course.end_date,
        course.status,
        course.max_students
      ]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Course | null> {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByCode(code: string): Promise<Course | null> {
    const result = await pool.query('SELECT * FROM courses WHERE code = $1', [code]);
    return result.rows[0] || null;
  }

  static async findAll(limit = 100, offset = 0): Promise<Course[]> {
    const result = await pool.query(`
      SELECT c.*, u.first_name || ' ' || u.last_name as teacher_name
      FROM courses c 
      JOIN users u ON c.teacher_id = u.id 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
  }

  static async findByTeacher(teacherId: number): Promise<Course[]> {
    const result = await pool.query('SELECT * FROM courses WHERE teacher_id = $1', [teacherId]);
    return result.rows;
  }

  static async update(id: number, course: Partial<Course>): Promise<Course | null> {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(course)) {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE courses SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
