<template>
  <div v-if="db_in_storage">
    <button class="download-db-btn"
      @click="exportDatabase">
      Download database
    </button>

    <NewJobApplication
      :applicationStatusOptions="applicationStatusOptions"
      @add-new-application="addNewJobApplication"
    />

    <EventHeatmap
      :jatEvents="jatEvents"
      :year="2026"
      @add-event="addEvent"
      @delete-event="deleteEvent"
    />

    <ApplicationsHolder
      :companies="companies_prop"
      :applicationStatusOptions="applicationStatusOptions"
      @filter-by-company="filterApplicationsByCompany"
      @filter-by-status="filterApplicationsByStatus"
      @update-application-status="updateApplicationStatus"
      @update-short-note="updateShortNote"
      @update-application-notes="updateApplicationNotes"
    />
  </div>

  <div v-else>
    <div class="startup">
      <input
        type="file"
        accept=".sqlite,.db"
        @change="databaseSelected"
      />
      <button @click="createFreshDatabase">
        Start Empty
      </button>
    </div>
    <div class="schema-section" >
      <button class="help-buttton" @click="showSchema = !showSchema">
        ?
      </button>
      <pre v-if="showSchema" class="schema-viewer">
        <code>
          Uses a portable SQLite database, with the following schema
          
          CREATE TABLE job_applications(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            position TEXT NOT NULL,
            status TEXT NOT NULL,
            shortnotes TEXT,
            notes TEXT
          );
          CREATE TABLE events(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scheduled_date TEXT NOT NULL,
            scheduled_time TEXT NOT NULL,
            engagement TEXT NOT NULL
          );
        </code>
      </pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NewJobApplication from './components/NewJobApplication.vue'
import EventHeatmap from './components/EventHeatmap.vue'
import ApplicationsHolder from './components/ApplicationsHolder.vue'

import {
  createEmptyDatabase,
  loadDatabaseFromFile,
  loadDatabaseFromIndexedDB,
  createApplicationDB,
  listApplicationsDB,
  updateStatusDB,
  updateNotesDB,
  updateShortNoteDB,
  listAllEventsDB,
  addJATEventDB,
  deleteJATEventDB,
  getDB
} from "./db/db"

import{
  loadDBFromStorage,
  saveDBIntoStorage,
  deleteDatabaseFromStorage
} from "./db/storage"

import { ref } from "vue"

const db_in_storage = ref(true)

const applicationStatusOptions = ref(["ready to apply", "in progress", "offer", "reject", "archive"])

const companies = ref([])
const companies_prop = ref([])
const jatEvents = ref({})

const showSchema = ref(false)

onMounted(async () => {
  try {
      const [savedDB] = await loadDBFromStorage();
      
      if (savedDB) {
          console.log("Data loaded from indexedDB successfully:", savedDB);
          await loadDatabaseFromIndexedDB(savedDB)
          companies.value = listApplicationsDB()
          companies_prop.value = companies.value
          jatEvents.value = listAllEventsDB()
          db_in_storage.value = true
      } else {
          console.log("No data found in storage.");
          db_in_storage.value = false
      }
  } catch (error) {
      console.error("Failed to load database:", error);
      db_in_storage.value = false
  }
})

async function databaseSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  await loadDatabaseFromFile(file)
  console.log("database loaded")
  companies.value = listApplicationsDB()
  companies_prop.value = companies.value
  jatEvents.value = listAllEventsDB()
  db_in_storage.value = true
}

async function createFreshDatabase() {
  await createEmptyDatabase()
  console.log("empty database created")
  companies_prop.value = companies.value
  db_in_storage.value = true
}

async function addEvent(payload) {
  console.log("addEvent", payload)
  if (payload.date.trim() === "" || payload.time.trim() === "" || payload.title.trim() === "") return
  const id = addJATEventDB(payload.date.trim(), payload.time.trim(), payload.title.trim())
  if (id){
    let tempEvents =  jatEvents.value[payload.date.trim()]
    if (tempEvents){
      jatEvents.value[payload.date.trim()].push({
        id: id,
        time: payload.time.trim(), 
        title: payload.title.trim()
      })
    }else{
        jatEvents.value[payload.date.trim()] =[{
          id: id,
          time: payload.time.trim(), 
          title: payload.title.trim() 
        }]
    }
  }
  const db = getDB()
  const data = db.export()
  await saveDBIntoStorage(data)
}

async function deleteEvent(payload) {
  console.log("deleteEvent", payload)
  if (payload.date.trim() === "" || payload.time.trim() === "" || !payload.event_id) return
  let tempEvents =  jatEvents.value[payload.date.trim()]
  if (tempEvents){
    const idx = jatEvents.value[payload.date.trim()].findIndex(e => e.id === payload.event_id)
    jatEvents.value[payload.date.trim()].splice(idx, 1)
  }
  deleteJATEventDB(payload.event_id)
  const db = getDB()
  const data = db.export()
  await saveDBIntoStorage(data)
}

async function addNewJobApplication(newJobApplication) {
  console.log("addNewJobApplication", newJobApplication)
  if (newJobApplication.companyName.trim() === "" || newJobApplication.position.trim() === "" || newJobApplication.status.trim() === "") return
  const id = createApplicationDB(newJobApplication.companyName.trim() , newJobApplication.position.trim(), newJobApplication.status.trim())
  console.log("addNewJobApplication id:", id)
  const idx = companies.value.findIndex(company => company.name === newJobApplication.companyName)
  if (idx !== -1){
    companies.value[idx].applications.push({
      id: id,
      company: newJobApplication.companyName.trim(),
      position: newJobApplication.position.trim(),
      status: newJobApplication.status.trim(),
      short_note: "short note",
      notes: "interview experiences"
    })
  }else{
    companies.value.push({
      name: newJobApplication.companyName.trim(),
      applications: [{
        id: id,
        company: newJobApplication.companyName.trim(),
        position: newJobApplication.position.trim(),
        status: newJobApplication.status.trim(),
        short_note: "short note",
        notes: "interview experiences"
      }]
    })    
  }
  companies_prop.value = [...companies.value]
  console.log(newJobApplication)
  const db = getDB()
  const data = db.export()
  await saveDBIntoStorage(data)
}

function filterApplicationsByCompany(companyName) {
  if (companyName === "") {
    companies_prop.value = []
    companies_prop.value = companies.value
    return
  }
  const company = companies.value.find(c => c.name.trim().toLowerCase() === companyName.trim().toLowerCase())
  companies_prop.value = []
  companies_prop.value = company ? [company] : []
}

function filterApplicationsByStatus(applicationStatus) {
  if (applicationStatus === "") {
    companies_prop.value = []
    companies_prop.value = companies.value
    return
  }
  companies_prop.value = []
  for (let c of companies.value) {
    const applications = c.applications.filter(
      app => app.status === applicationStatus
    )
    if (applications.length > 0) {
      companies_prop.value.push({
        name: c.name,
        applications
      })
    }
  }
}

async function updateApplicationStatus(payload) {
  console.log("updateApplicationStatus", payload)
  let comp_idx = 0
  for (let c of companies.value) {
    const app_idx = c.applications.findIndex(
      app => app.id === payload.applicationId
    )
    if (app_idx !== -1) {
      companies.value[comp_idx].applications[app_idx].status = payload.status
        updateStatusDB(payload.applicationId, payload.status)
        const db = getDB()
        const data = db.export()
        await saveDBIntoStorage(data)
      return
    }
    comp_idx += 1
  }
}

async function updateShortNote(payload) {
  console.log("updateShortNote", payload)
  let comp_idx = 0
  for (let c of companies.value) {
    const app_idx = c.applications.findIndex(
      app => app.id === payload.applicationId
    )
    if (app_idx !== -1) {
      companies.value[comp_idx].applications[app_idx].short_note = payload.shortNote
      updateShortNoteDB(payload.applicationId, payload.shortNote)
      const db = getDB()
      const data = db.export()
      await saveDBIntoStorage(data)    
      return
    }
    comp_idx += 1
  }
}

async function updateApplicationNotes(payload) {
  console.log("updateApplicationNotes", payload)
  let comp_idx = 0
  for (let c of companies.value) {
    const app_idx = c.applications.findIndex(
      app => app.id === payload.applicationId
    )
    if (app_idx !== -1) {
      companies.value[comp_idx].applications[app_idx].notes = payload.notes
      updateNotesDB(payload.applicationId, payload.notes)
      const db = getDB()
      const data = db.export()
      await saveDBIntoStorage(data)      
      return
    }
    comp_idx += 1
  }
}

async function exportDatabase() {
    const db = getDB()
    const data = db.export();
    const buffer = new Uint8Array(data);
    const blob = new Blob([buffer], { type: "application/sqlite" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jat.db";
    a.click();
    URL.revokeObjectURL(a.href);
    await deleteDatabaseFromStorage()
}

</script>

<style>
body {
  align-items: center;
  background: #f5f6f8;
  font-family: Roboto;
  justify-content: space-between;
  margin: 50px;
}

.app-container {
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.startup {
  width: 50%;
  margin: 60px auto;
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.startup input[type="file"] {
  flex: 1;
  font-size: 14px;
}

.startup button {
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  background: #111827;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.startup button:hover {
  background: #1f2937;
}


.download-db-btn {
  margin-left: auto;
  display: block;
  align-items: center;
  padding: 12px 18px;
  border-radius: 10px;
  background: #ef4444;
  color: black;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

.download-db-btn:hover {
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.35);
}


.schema-section {
  width: 100%;
  margin-top: 16px;
}

.schema-section button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
  background: #040404;
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

.schema-viewer {
  margin: 0 auto;
  width: 50%;
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
}

.schema-viewer code {
  font-family: monospace;
}


</style>