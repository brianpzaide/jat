# Job Application Tracker

A job application tracker to help track and manage your job applications locally. It runs completely inside the browser.
This project was an exploration of using SQLite directly in the browser.

### Tech Stack

The application was built using:
* vuejs
* sql.js, in-memory SQLite database.
* IndexedDB to persist the SQLite database state across the browser reloads/refreshes.

Users can:

* start with an empty database
* upload an existing SQLite database file
* download/export their database at any time

### Lifecycle & Persistence
When the application reloads/browser refreshes:
* if a database exists in IndexedDB, it is restored automatically
* otherwise users can choose to upload an existing database or start fresh.

### Database Schema

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

### Running Locally

```bash
npm install
npm run dev
```
