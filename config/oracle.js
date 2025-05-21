import oracledb from 'oracledb';
import 'dotenv/config';
import path from 'path';

if (!process.env.TNS_ADMIN) {
  process.env.TNS_ADMIN = path.resolve('/app/wallet'); // wallet is in project root
}

const requiredEnv = ['ORACLE_USER', 'ORACLE_PASSWORD', 'ORACLE_CONNECT_STRING', 'TNS_ADMIN'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};

async function getConnection() {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error("Oracle DB connection failed:", err);
    throw err;
  }
}


export async function insertUser(user) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO users (user_id, first_name, last_name, email, role)
       VALUES (:id, :fname, :lname, :email, :role)`,
      {
        id: user.user_id,
        fname: user.first_name,
        lname: user.last_name,
        email: user.email,
        role: user.role,
      },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

export async function getAllUsers() {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `SELECT * FROM users`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } finally {
    await conn.close();
  }
}

export async function registerCourse(data) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO course_registrations 
       (first_name, last_name, course_id, course_title, total_payment, user_id)
       VALUES (:first_name, :last_name, :course_id, :course_title, :total_payment, :user_id)`,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        course_id: data.course_id,
        course_title: data.course_title,
        total_payment: data.total_payment || 900,
        user_id: data.user_id,
      },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

export async function getAllRegistrations() {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `SELECT * FROM course_registrations`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } finally {
    await conn.close();
  }
}

export async function updateRegistration(data) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `UPDATE course_registrations 
       SET total_payment = :total_payment 
       WHERE user_id = :user_id AND course_id = :course_id`,
      {
        total_payment: data.total_payment,
        user_id: data.user_id,
        course_id: data.course_id,
      },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

export async function deleteRegistration(user_id, course_id) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `DELETE FROM course_registrations 
       WHERE user_id = :user_id AND course_id = :course_id`,
      {
        user_id,
        course_id,
      },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

// Get total payments per user
export async function getPayments() {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `SELECT user_id, SUM(total_payment) AS total_payment 
       FROM course_registrations 
       GROUP BY user_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } finally {
    await conn.close();
  }
}
