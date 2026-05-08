-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the registrations table
create table public.registrations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  participant_name text not null,
  guardian1_name text not null,
  guardian1_phone text not null,
  guardian2_name text,
  guardian2_phone text,
  email text not null,
  selected_session text not null,
  total_price integer not null,
  paid boolean default false not null,
  confirmation_sent boolean default false not null
);

-- Set up Row Level Security (RLS)
alter table public.registrations enable row level security;

-- Create policies
-- 1. Anyone can insert a registration (public form)
create policy "Anyone can insert registrations"
  on public.registrations for insert
  with check (true);

-- 2. Only authenticated users (admins) can view, update or delete registrations
create policy "Authenticated users can view all registrations"
  on public.registrations for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update registrations"
  on public.registrations for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete registrations"
  on public.registrations for delete
  using (auth.role() = 'authenticated');
