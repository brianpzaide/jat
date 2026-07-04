# Job Application Tracker

A local-first job application tracker built with Vue 3, sql.js, and IndexedDB.

The goal was to build a responsive, privacy-focused application that is fully browser-based and works offline. The application runs entirely in the browser, user's data never leaves the device.

This project was an exploration of:

* SQLite in the browser
* local-first application architecture
* browser-only CRUD systems
* offline-capable UX patterns

## Tech Stack

The application uses:
* vuejs
* sql.js, in-memory SQLite database.
* IndexedDB stores the current SQLite database state, for browser persistence.

Users may:

* start with an empty database
* upload an existing SQLite database file
* download/export their database at any time

When the application reloads/browser refreshes:

* if a database exists in IndexedDB, it is restored automatically
* otherwise users may:

  * upload a database
  * start fresh


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

## Running Locally

```bash
npm install
npm run dev
```