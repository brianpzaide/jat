<template>

  <NewJobApplication/>

  <EventHeatmap
    :events="events"
    :year="2026"
    @day-click="openDialog"
  />

  <ApplicationsHolder
  :companies="companies"
  />
</template>

<script setup>
import NewJobApplication from './components/NewJobApplication.vue'
import EventHeatmap from './components/EventHeatmap.vue'
import ApplicationsHolder from './components/ApplicationsHolder.vue'

import { ref } from "vue"

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
      {id:"11", position: "backend engineer", status: "ready to apply", next_event: "2026-03-18 12:30:00" },
      {id:"12", position: "frontend engineer", status: "applied", next_event: "2026-03-19 13:30:00" },
      {id:"13", position: "fullstack engineer", status: "interview scheduled", next_event: "2026-03-20 14:30:00" },
    ]}, 
    {name: "Company 2", applications:[
      {id:"21", position: "swe", status: "applied", next_event: "2026-03-11 11:30:00" },
      {id:"22", position: "forward deployed engineer", status: "rejected", next_event: "2026-03-11 18:30:00" },
    ]}, 
    {name: "Company 3", applications:[
      {id:"31", position: "dev rel", status: "interview scheduled", next_event: "2026-03-15 11:30:00" },
      {id:"32", position: "customer support", status: "applied", next_event: "2026-03-15 11:30:00" },
    ]},
    {name: "Company 4", applications:[
      {id:"41", position: "content writer", status: "accepted", next_event: "2026-03-15 11:30:00" },
    ]}
])

function openDialog(date) {
  console.log("open dialog for", date)
}

function handleSave(content) {
  console.log('Saved content:', content)
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