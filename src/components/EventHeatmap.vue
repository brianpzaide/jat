<template>
  <div class="m-5 text-center rounded-xl border border-gray-200 bg-white p-6">
    <h2 class="mb-5 text-lg font-semibold text-gray-900">
      {{ props.year }} Calendar
    </h2>

    <div class="flex flex-wrap justify-center gap-5">
      <div
        v-for="month in months"
        :key="month.index"
        class="flex flex-col items-center"
      >
        <div class="mb-2 text-xs font-medium text-gray-600">
          {{ month.name }}
        </div>

        <div
          class="grid grid-flow-col grid-rows-[repeat(7,10px)] auto-cols-[10px] gap-[3px]"
        >
          <button
            v-for="day in month.days"
            :key="day.date"
            type="button"
            class="h-[10px] w-[10px] rounded-[2px] transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="getLevelClass(day.events.length)"
            :style="{ gridRowStart: day.weekday + 1 }"
            :aria-label="`${day.date}: ${day.events.length} events`"
            @mouseenter="showTooltip($event, day)"
            @mousemove="moveTooltip"
            @mouseleave="hideTooltip"
            @focus="showTooltip($event, day)"
            @blur="hideTooltip"
            @click="dayClicked(day)"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="tooltip.visible"
    class="pointer-events-none fixed z-[9999] w-[220px] rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-lg"
    :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
  >
    <strong class="mb-2 block text-gray-900">
      {{ tooltip.date }}
    </strong>

    <div v-if="tooltip.events.length === 0" class="text-gray-500">
      No events
    </div>

    <div
      v-for="event in tooltip.events"
      :key="event.id ?? event.time"
      class="mb-1 last:mb-0"
    >
      <span class="font-medium text-gray-700">{{ event.time }}</span>
      <span class="text-gray-600">: {{ event.title }}</span>
    </div>
  </div>

  <dialog
    ref="eventDialog"
    aria-labelledby="event-dialog-title"
    aria-describedby="event-dialog-description"
    class="w-[calc(100%-2rem)] max-w-lg rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
    @close="dialog.visible = false"
  >
    <div class="border-b border-gray-200 px-5 py-4">
      <h3
        id="event-dialog-title"
        class="text-lg font-semibold text-gray-900"
      >
        Events
      </h3>

      <p
        id="event-dialog-description"
        class="mt-1 text-sm text-gray-500"
      >
        {{ formatDate(dialog.date) }}
      </p>
    </div>

    <div class="space-y-4 px-5 py-4">
      <div class="space-y-3">
        <div>
          <label
            for="event-time"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Time
          </label>

          <input
            id="event-time"
            v-model="dialog.time"
            type="text"
            placeholder="e.g. 10:00 - 11:00"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            for="event-description"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <input
            id="event-description"
            v-model="dialog.title"
            type="text"
            placeholder="e.g. Meeting with the team"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div>
        <h4 class="mb-2 text-sm font-medium text-gray-700">
          Events for this date
        </h4>

        <div
          v-if="props.jatEvents[dialog.date]?.length"
          class="max-h-56 space-y-2 overflow-y-auto overscroll-contain"
        >
          <div
            v-for="event in props.jatEvents[dialog.date]"
            :key="event.id ?? event.time"
            class="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <div class="min-w-0">
              <div class="text-xs font-semibold text-gray-600">
                {{ event.time }}
              </div>

              <div class="mt-1 break-words text-sm text-gray-900">
                {{ event.title }}
              </div>
            </div>

            <button
              type="button"
              aria-label="Delete event"
              class="shrink-0 rounded-md px-2 py-1 text-lg leading-none text-red-500 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              @click.stop="deleteEvent(event.id, dialog.date, event.time)"
            >
              ×
            </button>
          </div>
        </div>

        <div
          v-else
          class="rounded-lg border border-dashed border-gray-200 py-5 text-center text-sm text-gray-500"
        >
          No events for this date
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-3">
      <button
        type="button"
        class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        @click="eventDialog.close()"
      >
        Cancel
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="addEvent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add event
      </button>
    </div>
  </dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
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
  jatEvents: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['add-event', 'delete-event'])

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const eventDialog = ref(null)

const dialog = reactive({
  visible: false,
  date: '',
  time: '',
  title: '',
})

watch(
  () => dialog.visible,
  (visible) => {
    const element = eventDialog.value

    if (!element) return

    if (visible && !element.open) {
      element.showModal()
    } else if (!visible && element.open) {
      element.close()
    }
  }
)

const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  date: '',
  events: [],
})

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function formatKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(dateKey) {
  if (!dateKey) return ''

  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day).toDateString()
}

const months = computed(() => {
  const result = []

  for (let month = 0; month < 12; month++) {
    const days = []

    const daysInMonth = getDaysInMonth(props.year, month)

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(props.year, month, day)
      const key = formatKey(date)

      days.push({
        date: key,
        weekday: date.getDay(),
        events: props.jatEvents[key] || [],
      })
    }

    result.push({
      index: month,
      name: monthNames[month],
      days,
    })
  }

  return result
})

function getLevelClass(count) {
  if (count === 0) return 'bg-gray-100'
  if (count === 1) return 'bg-green-200'
  if (count <= 2) return 'bg-green-400'
  if (count <= 4) return 'bg-green-600'

  return 'bg-green-800'
}

function showTooltip(event, day) {
  tooltip.visible = true
  tooltip.date = formatDate(day.date)
  tooltip.events = day.events

  moveTooltip(event)
}

function moveTooltip(event) {
  tooltip.x = event.clientX + 8
  tooltip.y = event.clientY + 8
}

function hideTooltip() {
  tooltip.visible = false
}

function openDialog(date) {
  dialog.visible = true
  dialog.date = date
  dialog.time = ''
  dialog.title = ''
}

function dayClicked(day) {
  openDialog(day.date)
}

function addEvent() {
  if (!dialog.time || !dialog.title) return

  emit('add-event', {
    date: dialog.date,
    time: dialog.time,
    title: dialog.title,
  })
}

function deleteEvent(eventId, eventDate, eventTime) {
  if (!eventDate || !eventTime || !eventId) return

  emit('delete-event', {
    event_id: eventId,
    date: eventDate,
    time: eventTime,
  })
}
</script>