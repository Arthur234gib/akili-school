import pool from '../lib/db';

export interface User {
  id?: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
  first_name: string;
  last_name: string;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(user: User): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user.username, user.email, user.password_hash, user.role, user.first_name, user.last_name, user.phone]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findAll(limit = 100, offset = 0): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
    return result.rows;
  }

  static async update(id: number, user: Partial<User>): Promise<User | null> {
    // Whitelist of allowed update fields for security
    const allowedFields = ['email', 'first_name', 'last_name', 'phone'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(user)) {
      if (value !== undefined && key !== 'id' && allowedFields.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
