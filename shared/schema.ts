import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  genre: text("genre").notNull(),
  description: text("description"),
  amazonLink: text("amazon_link"),
  translations: jsonb("translations").$type<{
    [key: string]: {
      amazonLink: string;
      languageCode: string;
    };
  }>(),
  coverColor: text("cover_color").notNull().default("purple"),
  coverImage: text("cover_image"),
  featured: boolean("featured").notNull().default(false),
  dateAdded: text("date_added").notNull(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
}).extend({
  description: z.string().optional().nullable(),
  amazonLink: z.string().optional().nullable(),
  translations: z.record(z.object({
    amazonLink: z.string().url(),
    languageCode: z.string()
  })).optional().nullable(),
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
