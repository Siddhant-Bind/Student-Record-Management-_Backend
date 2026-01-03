# Student Record Management System (SRMS)

## Setup Instructions

1.  **Dependencies**:
    Run `npm install` to install dependencies.

2.  **Environment Variables**:
    Create a `.env` file in the root directory and add your Supabase credentials:

    ```
    PORT=3000
    SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    ```

    > **Note**: The `SUPABASE_SERVICE_ROLE_KEY` is required for Admin operations (creating users).

3.  **Database Setup**:

    - Copy the contents of `database/init.sql`.
    - Go to your Supabase Dashboard -> SQL Editor.
    - Paste and run the script to create tables and RLS policies.
    - **Bootstrap**: You must manually create the first Teacher via Supabase Dashboard (Authentication -> Add User) or SQL if you prefer. Then manually insert a profile for them:
      ```sql
      insert into public.profiles (id, role) values ('USER_UUID_HERE', 'teacher');
      insert into public.teachers (id, full_name, department) values ('USER_UUID_HERE', 'First Teacher', 'Admin');
      ```

4.  **Running the Server**:
    - `npm start` (Production)
    - `npm run dev` (Development with nodemon)

## API Endpoints

### Auth

- `POST /auth/login` (email, password)
- `POST /auth/logout` (Bearer Token)

### Student (Protected)

- `GET /students/me`
- `PATCH /students/me` (email, hobbies)

### Teacher (Protected)

- `POST /teachers/teachers` (Create new Teacher)
- `POST /teachers/students` (Create new Student)
- `GET /teachers/students` (List all)
- `GET /teachers/students/:id`
- `PUT /teachers/students/:id`
- `DELETE /teachers/students/:id`
