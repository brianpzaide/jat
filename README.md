# Job Application Tracker

A local-first job application tracker built with Vue 3, sql.js, and IndexedDB.

The application runs entirely in the browser. User data never leaves the device unless the user explicitly downloads and shares the SQLite database file.

---

## Features

* fully browser-based
* offline capable
* SQLite-powered
* no backend
* no external storage

The goal was to build a responsive, privacy-focused application.

---

### Local-First Persistence

The application uses:

* sql.js (SQLite compiled to WebAssembly)
* IndexedDB for browser persistence

Users may:

* start with an empty database
* upload an existing SQLite database file
* download/export their database at any time

The downloaded SQLite file acts as the portable backup/source-of-truth.

---

## Tech Stack

* Vue 3
* sql.js
* IndexedDB

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS job_applications(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   company TEXT NOT NULL,
   position TEXT NOT NULL,
   status TEXT NOT NULL,
   shortnotes TEXT,
   notes TEXT
);
CREATE TABLE IF NOT EXISTS events(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   scheduled_date TEXT NOT NULL,
   scheduled_time TEXT NOT NULL,
   engagement TEXT NOT NULL
);
```

---

## Persistence Model

The application follows a local-first architecture.

### Runtime

* sql.js in-memory SQLite database

### Browser Persistence

* IndexedDB stores the current SQLite database state

### Export

* users can download the SQLite database file

When the application reloads/browser refreshes:

* if a database exists in IndexedDB, it is restored automatically
* otherwise users may:

  * upload a database
  * start fresh

---

## Why sql.js?

This project was an exploration of:

* SQLite in the browser
* local-first application architecture
* browser-only CRUD systems
* offline-capable UX patterns
---

## Running Locally

```bash
npm install
npm run dev
```


