import initSqlJs from "sql.js"


let SQL = null
let db = null

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
   engagement TEXT NOT NULL
);
`
export async function initDBEngine(){
    if (SQL) return
    SQL = await initSqlJs({
        locateFile: file =>`/sql-wasm.wasm`
    })
}

export async function createEmptyDatabase() {
    await initDBEngine()
    db = new SQL.Database()
    db.run(schema)
}

export async function loadDatabaseFromFile(file){
    await initDBEngine()
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    db = new SQL.Database(uint8Array)
    db.run(schema)
}

export async function loadDatabaseFromIndexedDB(savedDB){
    await initDBEngine()
    db = new SQL.Database(savedDB)
    db.run(schema)
}

const create_application = "INSERT INTO job_applications(company, position, status, shortnotes, notes) VALUES(?, ?, ?, ?, ?) RETURNING id;";
export function createApplicationDB(companyName, position, status){
    const row = db.exec(create_application, [companyName, position, status, 'short notes', 'interview experience notes']);
    console.log("in create new job application: row[0].values", row[0].values)
    console.log("in create new job application: row[0].values[0]", row[0].values[0][0])
    return row[0].values[0][0]
}

const list_companies = "SELECT DISTINCT company FROM job_applications;";
const list_applications_for = "SELECT * FROM job_applications WHERE company = ?;";
export function listApplicationsDB(){
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
    console.log(applications)
    return applications
}

const update_application_status = "UPDATE job_applications SET status = ? WHERE id = ?;";
export function updateStatusDB(applicationId, status){
    try{
        db.run(update_application_status, [status, applicationId]);
        console.log("updating status successful")
    }catch(err){
        console.error("failed to updating status for application", err, applicationId)
    }
    
}

const update_application_notes = "UPDATE job_applications SET notes = ? WHERE id = ?;";
export function updateNotesDB(applicationId, notes){
    try{
        db.run(update_application_notes, [notes, applicationId]);
        console.log("updating notes successful")
    }catch(err){
        console.error("failed to updating notes for application", err, applicationId)
    }
}

const update_application_shortnotes = "UPDATE job_applications SET shortnotes = ? WHERE id = ?;";
export function updateShortNoteDB(applicationId, short_notes){
    try{
        db.run(update_application_shortnotes, [short_notes, applicationId]);
        console.log("updating short notes successful")
    }catch(err){
        console.error("failed to updating short notes for application", err, applicationId)
    }
    
}


const list_events = "SELECT * FROM events;";
export function listAllEventsDB(){
    const events = db.exec(list_events);
    let jat_events = {}
    for (const e of events[0].values){
        if (!jat_events[e[1]]) {
            jat_events[e[1]] = [{
                "id": e[0],
                "time": e[2],
                "title": e[3]
            }]
        }else{
            jat_events[e[1]].push({
                "id": e[0],
                "time": e[2],
                "title": e[3]                
            })
        } 
    }
    console.log(jat_events)
    return jat_events
}

const add_event = "INSERT INTO events (scheduled_date, scheduled_time, engagement) VALUES (?, ?, ?) RETURNING id;";
export function addJATEventDB(scheduled_date, scheduled_time, engagement){
    console.log(scheduled_date, scheduled_time, engagement)
    try{
        const row = db.exec(add_event, [scheduled_date, scheduled_time, engagement]);
        return row[0].values[0][0]
    }catch(err) {
        console.error("failed to insert event", err)
        return null
    }   
}

const delete_event = "DELETE FROM events WHERE id = ?";
export function deleteJATEventDB(id){
    db.run(delete_event, [id]);
}

export function getDB(){
    return db
}