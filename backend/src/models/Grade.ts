import pool from '../lib/db';

export interface Grade {
  id?: number;
  student_id: number;
  course_id: number;
  assignment_id?: number;
  grade_value: number;
  grade_letter?: string;
  weight?: number;
  graded_by?: number;
  graded_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class GradeModel {
  static async create(grade: Grade): Promise<Grade> {
    const result = await pool.query(
      `INSERT INTO grades (student_id, course_id, assignment_id, grade_value, grade_letter, weight, graded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        grade.student_id,
        grade.course_id,
        grade.assignment_id,
        grade.grade_value,
        grade.grade_letter,
        grade.weight || 1.0,
        grade.graded_by
      ]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Grade | null> {
    const result = await pool.query('SELECT * FROM grades WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByStudent(studentId: number): Promise<Grade[]> {
    const result = await pool.query(`
      SELECT g.*, c.name as course_name, c.code as course_code
      FROM grades g
      JOIN courses c ON g.course_id = c.id
      WHERE g.student_id = $1
      ORDER BY g.graded_at DESC
    `, [studentId]);
    return result.rows;
  }

  static async findByStudentAndCourse(studentId: number, courseId: number): Promise<Grade[]> {
    const result = await pool.query(`
      SELECT g.*, a.title as assignment_title
      FROM grades g
      LEFT JOIN assignments a ON g.assignment_id = a.id
      WHERE g.student_id = $1 AND g.course_id = $2
      ORDER BY g.graded_at DESC
    `, [studentId, courseId]);
    return result.rows;
  }

  static async findByCourse(courseId: number): Promise<Grade[]> {
    const result = await pool.query(`
      SELECT g.*, u.first_name, u.last_name, s.student_number
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE g.course_id = $1
      ORDER BY g.graded_at DESC
    `, [courseId]);
    return result.rows;
  }

  static async update(id: number, grade: Partial<Grade>): Promise<Grade | null> {
    // Whitelist of allowed update fields for security
    const allowedFields = ['grade_value', 'grade_letter', 'weight'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(grade)) {
      if (value !== undefined && key !== 'id' && allowedFields.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE grades SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM grades WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async calculateCourseAverage(studentId: number, courseId: number): Promise<number | null> {
    const result = await pool.query(`
      SELECT 
        SUM(grade_value * weight) / SUM(weight) as weighted_average
      FROM grades
      WHERE student_id = $1 AND course_id = $2
    `, [studentId, courseId]);
    
    return result.rows[0]?.weighted_average || null;
  }
}
