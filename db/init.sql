--SQL queries for Supabase


-- Create Enum for Roles
create type user_role as enum ('student', 'teacher');

-- Create Profiles Table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  role user_role not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Create Teachers Table
create table public.teachers (
  id uuid not null references public.profiles(id) on delete cascade primary key,
  full_name text not null,
  department text not null,
  created_at timestamptz default now()
);

alter table public.teachers enable row level security;

-- Create Students Table
create table public.students (
  id uuid not null references public.profiles(id) on delete cascade primary key,
  roll_number text not null unique,
  full_name text not null,
  email text not null,
  hobbies text[] default '{}',
  marks jsonb default '{}',
  created_by uuid references public.profiles(id), -- Only teachers create students
  created_at timestamptz default now()
);

alter table public.students enable row level security;

-- POLICIES

-- PROFILES
-- View own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);



-- TEACHERS

create policy "Teachers can view all teachers" on public.teachers
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher')
  );
  

create policy "Teachers can view own teacher record" on public.teachers
  for select using (auth.uid() = id);

-- STUDENTS
-- Teachers can view all students
create policy "Teachers can view all students" on public.students
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher')
  );

-- Teachers can insert students
create policy "Teachers can insert students" on public.students
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher')
  );

-- Teachers can update students
create policy "Teachers can update all students" on public.students
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher')
  );

-- Teachers can delete students
create policy "Teachers can delete students" on public.students
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher')
  );

-- Students can view their own record
create policy "Students can view own record" on public.students
  for select using (auth.uid() = id);


create policy "Students can update own record" on public.students
  for update using (auth.uid() = id);


