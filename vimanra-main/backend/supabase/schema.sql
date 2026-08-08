-- Vimanra: additive schema migration for Admin Dashboard <-> Backend <-> DB connection.
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query > Run).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS).

-- Enquiries: stores contact-form submissions from the public website so the
-- Admin dashboard's Enquiries page can list/reply/close them.
create table if not exists public.enquiries (
  enquiry_id serial primary key,
  name text not null,
  email text not null,
  phone text,
  channel text not null default 'Contact Form',
  message text not null,
  status text not null default 'New',
  reply_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reviews: the Admin dashboard can hide a review from the public site and
-- tracks where a review came from (manual entry vs. an OTA).
alter table public.reviews
  add column if not exists visible boolean not null default true;

alter table public.reviews
  add column if not exists source text not null default 'Manual (Admin)';

-- Gallery: images can target the homepage hero slideshow ('hero') in
-- addition to the general Resort Photo Gallery ('gallery', the default).
alter table public.gallery
  add column if not exists section text not null default 'gallery';

alter table public.gallery
  add column if not exists slot text;

-- Rooms: fully admin-managed room catalog shown on the public Accommodation
-- section — subtitle (e.g. "Lake Facing") and a handful of feature tags.
alter table public.rooms
  add column if not exists subtitle text;

alter table public.rooms
  add column if not exists features jsonb not null default '[]'::jsonb;

-- Services: doubles as the public site's "Amenities & Facilities" section,
-- which also shows a category label, a photo, and a few highlight bullets.
alter table public.services
  add column if not exists category text;

alter table public.services
  add column if not exists highlights jsonb not null default '[]'::jsonb;

alter table public.services
  add column if not exists image_url text;

-- Things To Do: local attractions shown on the public site, managed from the
-- Admin dashboard the same way Services/Gallery are.
create table if not exists public.things_to_do (
  thing_id serial primary key,
  admin_id integer,
  title text not null,
  category text,
  icon text not null default 'Compass',
  distance text,
  time text,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
