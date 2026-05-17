import initSqlJs from "sql.js"

import {
    saveDatabase,
    loadDatabase
} from "./storage"


const schema =`
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
   engagement TEXT
);
`

let create_application = "INSERT INTO job_applications(company, position, status, shortnotes, notes) VALUES(?, ?, ?, ?, ?);";

let list_companies = "SELECT DISTINCT company FROM job_applications;";

let list_applications_for = "SELECT * FROM job_applications WHERE company = ?;";

let update_application_status = "UPDATE job_applications WHERE id = ? SET status = ?;";

let update_application_notes = "UPDATE job_applications WHERE id = ? SET notes = ?;";

let update_application_shortnotes = "UPDATE job_applications WHERE id = ? SET shortnotes = ?;";

let list_events = "SELECT * FROM events;";

let add_event = "INSERT INTO events(scheduled_date, scheduled_time, engagement) VALUES(?, ?, ?);";

let delete_event = "DELETE FROM events WHERE scheduled_date = ? AND scheduled_time = ?";

let SQL = null
let db = null

export async function initEngine(){
    if (SQL) return
    SQL = await initSqlJs({
        locateFile: file =>`/sql-wasm.wasm`
    })
    const savedDb = await loadDatabase()
    if (savedDb) {
        db = new SQL.Database(savedDb)
    } else {
        db = new SQL.Database()
        db.run(schema)
        const data = db.export()
        await saveDatabase(data)
    }
}

export async function createEmptyDatabase() {
    await initEngine()
    db = new SQL.Database()
    db.run(schema)
    return db
}

export async function loadDatabaseFromFile(file){
    await initEngine()
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    db = new SQL.Database(uint8Array)
    db.run(schema)
    return db
}

export function createApplication(companyName, position, status){
    db.run(create_application, [companyName, position, status, 'short note', 'interview experience notes']);
}

export function listApplications(){
    const companyResults = db.exec(list_companies)
    if (companyResults.length === 0) {
        return []
    }
    const applications = []
    for (const row of companyResults[0].values) {
        const company = row[0]
        const appResults = db.exec(
            list_applications_for,
            [company]
        )
        const appsForCompany = []
        if (appResults.length > 0) {
            for (const appRow of appResults[0].values) {
                appsForCompany.push({
                    id: appRow[0],
                    company: company,
                    position: appRow[2],
                    status: appRow[3],
                    short_note: appRow[4],
                    notes: appRow[5]
                })
            }
        }
        applications.push({
            name: company,
            applications: appsForCompany
        })
    }
    return applications
}

export function listAllEvents(){
    const events = db.exec(list_events);
    let jat_events = {}
    for (const e of events[0].values){
        if (jat_events[e[1]] !== null) {
            jat_events[e[1]] = [{
                "time": e[2],
                "title": e[3]
            }]
        }else{
            jat_events[e[1]].push({
                "time": e[2],
                "title": e[3]                
            })
        } 
    }
    console.log(jat_events)
    return jat_events
}

export function addJATEvent(scheduled_date, scheduled_time, engagement){
    db.run(add_event, [scheduled_date, scheduled_time, engagement]); 
}

export function deleteJATEvent(scheduled_date, scheduled_time){
    db.run(delete_event, [scheduled_date, scheduled_time]);
}

export function updateStatus(applicationId, status){
    db.run(update_application_status, [applicationId, status]);
}

export function updateNotes(applicationId, notes){
    db.run(update_application_notes, [applicationId, notes]);
}

export function updateShortNotes(applicationId, short_notes){
    db.run(update_application_shortnotes, [applicationId, short_notes]);
}

export function getDB(){
    return db
}

