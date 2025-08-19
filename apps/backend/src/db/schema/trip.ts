import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { timestamps } from '../utils';

export const visibilityEnum = pgEnum('visibility', [
  'private',
  'public',
  'unlisted',
]);
export const statusEnum = pgEnum('status', ['active', 'archived']);
export const locationTypeEnum = pgEnum('location_type', [
  'start',
  'end',
  'stop',
]);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'audio']);
export const transportTypeEnum = pgEnum('transport_type', [
  'on_foot',
  'bicycle',
  'car',
  'motorbike',
  'bus',
  'plane',
  'ship',
  'boat',
]);
export const roleEnum = pgEnum('role', ['viewer', 'editor', 'admin']);
export const inviteStatusEnum = pgEnum('invite_status', [
  'pending',
  'accepted',
  'declined',
  'revoked',
]);

export const trips = pgTable('trips', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  duration: integer('duration'),
  distance: real('distance'),
  visibility: visibilityEnum('visibility').notNull().default('private'),
  status: statusEnum('status').notNull().default('active'),
  ...timestamps,
});

export const tripLocations = pgTable('trip_locations', {
  id: text('id').primaryKey(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  country: text('country'),
  city: text('city'),
  lon: real('lon').notNull(),
  lat: real('lat').notNull(),
  type: locationTypeEnum('type').notNull(),
  stopIndex: integer('stop_index'),
  ...timestamps,
});

export const tripDays = pgTable('trip_days', {
  id: text('id').primaryKey(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  title: text('title'),
  dayNumber: integer('day_number').notNull(),
  ...timestamps,
});

export const tripDayNotes = pgTable('trip_day_notes', {
  id: text('id').primaryKey(),
  tripDayId: text('trip_day_id')
    .notNull()
    .references(() => tripDays.id, { onDelete: 'cascade' }),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  ...timestamps,
});

export const tripMedia = pgTable('trip_media', {
  id: text('id').primaryKey(),
  tripDayId: text('trip_day_id').references(() => tripDays.id, {
    onDelete: 'cascade',
  }),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  type: mediaTypeEnum('type').notNull(),
  s3Key: text('s3_key').notNull(),
  uploadedBy: text('uploaded_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const tripTransports = pgTable('trip_transports', {
  id: text('id').primaryKey(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  tripDayId: text('trip_day_id').references(() => tripDays.id, {
    onDelete: 'cascade',
  }),
  type: transportTypeEnum('type').notNull(),
  ...timestamps,
});

export const tripUsers = pgTable('trip_users', {
  id: text('id').primaryKey(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  addedBy: text('added_by')
    .notNull()
    .references(() => user.id),
  ...timestamps,
});

export const tripInvites = pgTable('trip_invites', {
  id: text('id').primaryKey(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  invitedUserId: text('invited_user_id').references(() => user.id),
  invitedUserEmail: text('invited_user_email').notNull(),
  invitedBy: text('invited_by')
    .notNull()
    .references(() => user.id),
  status: inviteStatusEnum('status').notNull().default('pending'),
  answeredAt: timestamp('answered_at'),
  ...timestamps,
});
