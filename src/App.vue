<template>

  <NewJobApplication
  :applicationStatusOptions="applicationStatusOptions"
  @add-new-application="addNewJobApplication"
  />

  <EventHeatmap
    :events="events"
    :year="2026"
    @day-click="openDialog"
  />

  <ApplicationsHolder
  :companies="companies_prop"
  :applicationStatusOptions="applicationStatusOptions"
  @filter-by-company="filterApplicationsByCompany"
  @filter-by-status="filterApplicationsByStatus"
  />
</template>

<script setup>
import NewJobApplication from './components/NewJobApplication.vue'
import EventHeatmap from './components/EventHeatmap.vue'
import ApplicationsHolder from './components/ApplicationsHolder.vue'

import { ref } from "vue"

const applicationStatusOptions = ref(["ready to apply", "in progress", "offer", "reject", "archive"])

const events = ref({
  "2026-03-05": [
    { time: "10:00 - 11:00", title: "Meeting with boss. Meeting with boss. Meeting with boss. Meeting with boss. Meeting with boss." },
    { time: "14:00 - 15:00", title: "Webinar on topic. Webinar on topic. Webinar on topic. Webinar on topic. Webinar on topic" }
  ],

  "2026-03-10": [
    { time: "09:00 - 10:00", title: "Standup meeting. Standup meeting. Standup meeting. Standup meeting. Standup meeting." }
  ]
})

const companies = ref([
    {name: "Company 1", applications:[
      {id:"11", company: "Company 1", position: "backend engineer", status: "ready to apply", short_note: "short note", notes: "interview experiences"},
      {id:"12", company: "Company 1", position: "frontend engineer", status: "in progress", short_note: "short note", notes: "interview experiences"},
      {id:"13", company: "Company 1", position: "fullstack engineer", status: "in progress", short_note: "short note", notes: "interview experiences"},
    ]}, 
    {name: "Company 2", applications:[
      {id:"21", company: "Company 2", position: "swe", status: "archive", short_note: "short note", notes: "interview experiences"},
      {id:"22", company: "Company 2", position: "forward deployed engineer", status: "reject", short_note: "short note", notes: "interview experiences"},
    ]}, 
    {name: "Company 3", applications:[
      {id:"31", company: "Company 3", position: "dev rel", status: "in progress", short_note: "short note", notes: "interview experiences"},
      {id:"32", company: "Company 3", position: "customer support", status: "archive", short_note: "short note", notes: "interview experiences"},
    ]},
    {name: "Company 4", applications:[
      {id:"41", company: "Company 4",position: "content writer", status: "offer", short_note: "short note", notes: "interview experiences"},
    ]},
    {name: "Company 5", applications:[
      {id:"51", company: "Company 5",position: "dev rel", status: "ready to apply", short_note: "short note", notes: "interview experiences"},
      {id:"52", company: "Company 5",position: "content writer", status: "offer", short_note: "short note", notes: "interview experiences"},
      {id:"53", company: "Company 5",position: "implementation", status: "offer", short_note: "short note", notes: "interview experiences"},
      {id:"54", company: "Company 5",position: "customer support", status: "in progress", short_note: "short note", notes: "interview experiences"},
    ]},
    {name: "Company 6", applications:[
      {id:"61", company: "Company 6",position: "dev rel", status: "in progress", short_note: "short note", notes: "interview experiences"},
    ]}
])

const companies_prop = ref([])
companies_prop.value = [...companies.value]




function openDialog(date) {
  console.log("open dialog for", date)
}

function addNewJobApplication(newJobApplication) {
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
}

function filterApplicationsByCompany(companyName) {
  if (companyName === "") {
    companies_prop.value = [...companies.value]
    return
  }

  const company = companies.value.find(c => c.name === companyName)

  companies_prop.value = company ? [company] : []
}

function filterApplicationsByStatus(applicationStatus) {
  if (applicationStatus === "") {
    companies_prop.value = [...companies.value]
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

</script>

<style>

body {
  align-items: center;
  background: #f5f6f8;
  font-family: Roboto, Arial, sans-serif;
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