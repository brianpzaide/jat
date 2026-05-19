<template>
  <div class="startup" v-if="initial">
    <input
      type="file"
      accept=".sqlite,.db"
      @change="databaseSelected"
    />
    <button @click="createFreshDatabase">
      Start Empty
    </button>
  </div>

  <div v-else>
    <button @click="exportDatabase">
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
</template>

<script setup>
import NewJobApplication from './components/NewJobApplication.vue'
import EventHeatmap from './components/EventHeatmap.vue'
import ApplicationsHolder from './components/ApplicationsHolder.vue'

import {
  loadDatabaseFromFile,
  createEmptyDatabase,
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



import { ref } from "vue"

const initial = ref(true)

const applicationStatusOptions = ref(["ready to apply", "in progress", "offer", "reject", "archive"])

const companies = ref([])
const companies_prop = ref([])
const jatEvents = ref({})

// const jatEvents = ref({
//   "2026-03-05": [
//     { id: 1, time: "10:00 - 11:00", title: "Meeting with boss. Meeting with boss." }
//   ],

//   "2026-03-10": [
//     { id: 1, time: "09:00 - 10:00", title: "Standup meeting." }
//   ]
// })

// const companies = ref([
//     {name: "Company 1", applications:[
//       {id:"11", company: "Company 1", position: "backend engineer", status: "ready to apply", short_note: "short note", notes: "interview experiences"},
//       {id:"12", company: "Company 1", position: "frontend engineer", status: "in progress", short_note: "short note", notes: "interview experiences"},
//       {id:"13", company: "Company 1", position: "fullstack engineer", status: "in progress", short_note: "short note", notes: "interview experiences"},
//     ]}, 
//     {name: "Company 2", applications:[
//       {id:"21", company: "Company 2", position: "swe", status: "archive", short_note: "short note", notes: "interview experiences"},
//       {id:"22", company: "Company 2", position: "forward deployed engineer", status: "reject", short_note: "short note", notes: "interview experiences"},
//     ]}, 
//     {name: "Company 3", applications:[
//       {id:"31", company: "Company 3", position: "dev rel", status: "in progress", short_note: "short note", notes: "interview experiences"},
//       {id:"32", company: "Company 3", position: "customer support", status: "archive", short_note: "short note", notes: "interview experiences"},
//     ]},
//     {name: "Company 4", applications:[
//       {id:"41", company: "Company 4",position: "content writer", status: "offer", short_note: "short note", notes: "interview experiences"},
//     ]},
//     {name: "Company 5", applications:[
//       {id:"51", company: "Company 5",position: "dev rel", status: "ready to apply", short_note: "short note", notes: "interview experiences"},
//       {id:"52", company: "Company 5",position: "content writer", status: "offer", short_note: "short note", notes: "interview experiences"},
//       {id:"53", company: "Company 5",position: "implementation", status: "offer", short_note: "short note", notes: "interview experiences"},
//       {id:"54", company: "Company 5",position: "customer support", status: "in progress", short_note: "short note", notes: "interview experiences"},
//     ]},
//     {name: "Company 6", applications:[
//       {id:"61", company: "Company 6",position: "dev rel", status: "in progress", short_note: "short note", notes: "interview experiences"},
//     ]}
// ])

async function databaseSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  await loadDatabaseFromFile(file)
  console.log("database loaded")
  companies.value = listApplicationsDB()
  companies_prop.value = companies.value
  initial.value = false
  jatEvents.value = listAllEventsDB()
}

async function createFreshDatabase() {
  await createEmptyDatabase()
  console.log("empty database created")
  companies_prop.value = companies.value
  initial.value = false
}

async function addEvent(payload) {
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
  // const db = getDB()
  // const data = db.export()
  // await saveDatabase(data)
}

async function deleteEvent(payload) {
  if (payload.date.trim() === "" || payload.time.trim() === "" || !payload.event_id) return
  let tempEvents =  jatEvents.value[payload.date.trim()]
  if (tempEvents){
    const idx = jatEvents.value[payload.date.trim()].findIndex(e => e.id === payload.event_id)
    jatEvents.value[payload.date.trim()].splice(idx, 1)
  }
  deleteJATEventDB(payload.event_id)
  // const db = getDB()
  // const data = db.export()
  // await saveDatabase(data)
}

async function addNewJobApplication(newJobApplication) {
  if (newJobApplication.companyName.trim() === "" || newJobApplication.position.trim() === "" || newJobApplication.status.trim() === "") return
  const idx = companies.value.findIndex(company => company.name === newJobApplication.companyName)
  if (idx !== -1){
    const n = companies.value[idx].applications.length
    companies.value[idx].applications.push({
      id: newJobApplication.companyName+n,
      company: newJobApplication.companyName,
      position: newJobApplication.position,
      status: newJobApplication.status,
      short_note: "short note",
      notes: "interview experiences"
    })
  }else{
    companies.value.push({
      name: newJobApplication.companyName,
      applications: [{
        id: newJobApplication.companyName+1,
        company: newJobApplication.companyName,
        position: newJobApplication.position,
        status: newJobApplication.status,
        short_note: "short note",
        notes: "interview experiences"
      }]
    })    
  }
  companies_prop.value = [...companies.value]
  console.log(newJobApplication)
  createApplicationDB(newJobApplication.companyName, newJobApplication.position, newJobApplication.status)
  // const db = getDB()
  // const data = db.export()
  // await saveDatabase(data)
}

function filterApplicationsByCompany(companyName) {
  if (companyName === "") {
    companies_prop.value = []
    companies_prop.value = companies.value
    return
  }
  const company = companies.value.find(c => c.name.trim().toLowerCase() === companyName)
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
  let comp_idx = 0
  for (let c of companies.value) {
    const app_idx = c.applications.findIndex(
      app => app.id === payload.applicationId
    )
    if (app_idx !== -1) {
      companies.value[comp_idx].applications[app_idx].status = payload.status
        updateStatusDB(payload.applicationId, payload.status)
        // const db = getDB()
        // const data = db.export()
        // await saveDatabase(data)
      return
    }
    comp_idx += 1
  }
}

async function updateShortNote(payload) {
  let comp_idx = 0
  for (let c of companies.value) {
    const app_idx = c.applications.findIndex(
      app => app.id === payload.applicationId
    )
    if (app_idx !== -1) {
      companies.value[comp_idx].applications[app_idx].short_note = payload.shortNote
      updateShortNoteDB(payload.applicationId, payload.shortNote)
      // const db = getDB()
      // const data = db.export()
      // await saveDatabase(data)      
      return
    }
    comp_idx += 1
  }
}

async function updateApplicationNotes(payload) {
  let comp_idx = 0
  for (let c of companies.value) {
    const app_idx = c.applications.findIndex(
      app => app.id === payload.applicationId
    )
    if (app_idx !== -1) {
      companies.value[comp_idx].applications[app_idx].notes = payload.notes
      updateNotesDB(payload.applicationId, payload.notes)
      // const db = getDB()
      // const data = db.export()
      // await saveDatabase(data)      
      return
    }
    comp_idx += 1
  }
}


function exportDatabase(){
  window.downloadDatabase = () => {
    const db = getDB()
    const data = db.export();
    const buffer = new Uint8Array(data);
    const blob = new Blob([buffer], { type: "application/sqlite" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jat.db";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  window.downloadDatabase()
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
</style>