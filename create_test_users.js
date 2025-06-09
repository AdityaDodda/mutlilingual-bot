import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function createTestUsers() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const testUsers = [
    {
      email: 'admin@lingomorphh.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User'
    },
    {
      email: 'demo@lingomorphh.com', 
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User'
    },
    {
      email: 'test@lingomorphh.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User'
    }
  ];

  for (const user of testUsers) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      const userId = uuidv4();
      
      await pool.query(`
        INSERT INTO users (id, email, password, first_name, last_name, auth_provider)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET
          password = $3,
          first_name = $4,
          last_name = $5,
          auth_provider = $6
      `, [userId, user.email, hashedPassword, user.firstName, user.lastName, 'email']);
      
      console.log(`Created/Updated user: ${user.email}`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
  
  await pool.end();
  console.log('Test users created successfully!');
}

createTestUsers();
