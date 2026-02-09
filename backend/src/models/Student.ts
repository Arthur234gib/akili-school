import pool from '../lib/db';

export interface Student {
  id?: number;
  user_id: number;
  student_number: string;
  date_of_birth: Date;
  gender: 'M' | 'F' | 'Other';
  address?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  enrollment_date: Date;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  created_at?: Date;
  updated_at?: Date;
}

export class StudentModel {
  static async create(student: Student): Promise<Student> {
    const result = await pool.query(
      `INSERT INTO students (user_id, student_number, date_of_birth, gender, address, 
        parent_name, parent_phone, parent_email, enrollment_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        student.user_id,
        student.student_number,
        student.date_of_birth,
        student.gender,
        student.address,
        student.parent_name,
        student.parent_phone,
        student.parent_email,
        student.enrollment_date,
        student.status
      ]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Student | null> {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: number): Promise<Student | null> {
    const result = await pool.query('SELECT * FROM students WHERE user_id = $1', [userId]);
    return result.rows[0] || null;
  }

  static async findByStudentNumber(studentNumber: string): Promise<Student | null> {
    const result = await pool.query('SELECT * FROM students WHERE student_number = $1', [studentNumber]);
    return result.rows[0] || null;
  }

  static async findAll(limit = 100, offset = 0): Promise<Student[]> {
    const result = await pool.query(`
      SELECT s.*, u.first_name, u.last_name, u.email 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
  }

  static async update(id: number, student: Partial<Student>): Promise<Student | null> {
    // Whitelist of allowed update fields for security
    const allowedFields = ['student_number', 'date_of_birth', 'gender', 'address', 
                           'parent_name', 'parent_phone', 'parent_email', 'enrollment_date', 'status'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(student)) {
      if (value !== undefined && key !== 'id' && allowedFields.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE students SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
