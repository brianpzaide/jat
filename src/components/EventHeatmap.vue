<template>
  <div class="card">
    <h2>{{ year }} Calendar</h2>

    <div class="heatmap">
      <div
        v-for="(month, index) in months"
        :key="index"
        class="month"
      >
        <div class="month-label">{{ month.name }}</div>

        <div class="month-grid">
          <div
            v-for="day in month.days"
            :key="day.date"
            class="day"
            :class="'level-' + getLevel(day.events.length)"
            :style="{ gridRowStart: day.weekday + 1 }"
            @mouseenter="showTooltip($event, day)"
            @mousemove="moveTooltip"
            @mouseleave="hideTooltip"
            @click="dayClicked(day)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="tooltip.visible"
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <strong>{{ tooltip.date }}</strong>

      <div v-if="tooltip.events.length === 0">
        No events
      </div>

      <div v-for="e in tooltip.events" :key="e.time">
        {{ e.time }} : {{ e.title }}
      </div>
    </div>
  </div>

  <div v-if="dialog.visible" class="dialog-overlay">
    <div class="dialog">
      <h3>Add Event</h3>
      <div class="dialog-date">
        {{ new Date(dialog.date).toDateString() }}
      </div>
      <input
        v-model="dialog.time"
        placeholder="Time (e.g. 10:00 - 11:00)"
      />
      <input
        v-model="dialog.title"
        placeholder="Event description"
      />
      <div class="dialog-actions">
        <button @click="addEvent">Add Event</button>
        <button @click="dialog.visible = false">Cancel</button>
      </div>
    </div>
  </div>


</template>

<script setup>
import { computed, reactive } from "vue"

const props = defineProps({
  year: {
    type: Number,
    default: new Date().getFullYear()
  },

  /*
  events format example:

  {
    "2026-03-05": [
        { time: "10:00 - 11:00", title: "Meeting with boss" },
        { time: "14:00 - 15:00", title: "Webinar on topic" }
    ]
  }
  */
  events: {
    type: Object,
    default: () => ({})
  }
})

const dialog = reactive({
  visible: false,
  date: "",
  time: "",
  title: ""
})

const emit = defineEmits(["add-event"])

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function formatKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const months = computed(() => {
  const result = []

  for (let month = 0; month < 12; month++) {

    const daysInMonth = getDaysInMonth(props.year, month)
    const days = []

    for (let day = 1; day <= daysInMonth; day++) {

      const date = new Date(props.year, month, day)
      const key = formatKey(date)

      days.push({
        date: key,
        weekday: date.getDay(),
        events: props.events[key] || []
      })
    }

    result.push({
      index: month,
      name: monthNames[month],
      days
    })
  }

  return result
})

function getLevel(count) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 2) return 2
  if (count <= 4) return 3
  return 4
}

const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  date: "",
  events: []
})

function showTooltip(e, day) {
  tooltip.visible = true
  tooltip.date = new Date(day.date).toDateString()
  tooltip.events = day.events
  moveTooltip(e)
}

function moveTooltip(e) {
  tooltip.x = e.clientX + 8
  tooltip.y = e.clientY + 8
}

function hideTooltip() {
  tooltip.visible = false
}

function dayClicked(day) {
  dialog.visible = true
  dialog.date = day.date
  dialog.time = ""
  dialog.title = ""
}

function addEvent() {
  if (!dialog.time || !dialog.title) return
  emit("add-event", {
    date: dialog.date,
    time: dialog.time,
    title: dialog.title
  })

  dialog.visible = false
}

</script>

<style scoped>
.card {
  background: #ffffff;
  padding: 24px 28px;
  border-radius: 10px;

  border: 1px solid #e5e7eb;

  display: flex;
  flex-direction: column;
  gap: 18px;

  margin: 20px;
}

.card h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

 .heatmap {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.month {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.month-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #666;
}

.month-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 9px);
  grid-auto-columns: 10px;
  gap: 3px;
}

.day {
  width: 10px;
  height: 10px;
  border-radius: 2px;

  cursor: pointer;
}

.level-0 { background: #ebedf0; }
.level-1 { background: #c6e48b; }
.level-2 { background: #7bc96f; }
.level-3 { background: #239a3b; }
.level-4 { background: #196127; }

.tooltip {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  pointer-events: none;
  width: 220px;
  max-width: 220px;
  z-index: 9999;
}

.dialog-overlay {

  position: fixed;
  inset: 0;

  background: rgba(0,0,0,0.35);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 10000;
}

.dialog {
  background: white;

  padding: 20px 24px;
  border-radius: 8px;

  width: 320px;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog h3 {
  margin: 0;
}

.dialog-date {
  font-size: 13px;
  color: #666;
}

.dialog input {
  padding: 6px 8px;

  border: 1px solid #ddd;
  border-radius: 4px;

  font-size: 13px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dialog-actions button {
  padding: 6px 10px;
  font-size: 13px;

  border: 1px solid #ddd;
  border-radius: 4px;

  background: #f5f5f5;
  cursor: pointer;
}

.dialog-actions button:hover {
  background: #eaeaea;
}
</style>