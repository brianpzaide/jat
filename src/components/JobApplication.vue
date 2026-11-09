<template>
  <div class="w-full">
    <button
      class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left
             transition-colors hover:bg-gray-100 focus:outline-none
             focus-visible:ring-2 focus-visible:ring-indigo-500"
      @click="toggle"
    >
      <span
        class="text-xs text-gray-400 transition-transform"
        :class="{ 'rotate-90': expanded }"
        aria-hidden="true"
      >
        ▶
      </span>

      <span class="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">
        {{ company.name }}
      </span>

      <span class="text-xs text-gray-400">
        {{ company.applications.length }}
      </span>
    </button>

    <div v-if="expanded" class="ml-3 mt-1 space-y-1 border-l border-gray-200 pl-3">
      <button
        v-for="application in company.applications"
        :key="application.id"
        class="w-full rounded-lg border px-3 py-2.5 text-left transition-colors
               focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        :class="
          application.id === activeApplicationId
            ? 'border-indigo-200 bg-indigo-50'
            : 'border-transparent bg-white hover:border-gray-200 hover:bg-gray-50'
        "
        @click="emit('application-selected', application.id)"
      >
        <div class="flex items-center justify-between gap-2">
          <span
            class="min-w-0 truncate text-sm font-medium"
            :class="
              application.id === activeApplicationId
                ? 'text-indigo-900'
                : 'text-gray-700'
            "
          >
            {{ application.position }}
          </span>

          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            :class="statusClass(application.status)"
          >
            {{ application.status }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  /*
  applications example:
  {
    name: "company_name",
    applications: [
        {id:"<application_id>", company: <company_name>, position: "<application_position>", status: "<application_status>", short_note: "<short_note>", notes: "<notes>""},
        {id:"<application_id>", company: <company_name>, position: "<application_position>", status: "<application_status>", short_note: "<short_note>", notes: "<notes>""}
    ]
  }
  */
  company: {
    type: Object,
    default: () => ({})
  },
  activeApplicationId: [String, Number]
})

const emit = defineEmits(['application-selected'])

const expanded = ref(false)

function toggle() {
  expanded.value = !expanded.value
}

function statusClass(status) {
  const classes = {
    'ready-to-apply': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    'offer': 'bg-green-100 text-green-700',
    'reject': 'bg-red-100 text-red-700',
    'archive': 'bg-gray-100 text-gray-600'
  }

  const key = status.toLowerCase().replaceAll(' ', '-')

  return classes[key] || 'bg-gray-100 text-gray-600'
}
</script>