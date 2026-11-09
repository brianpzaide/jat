<template>
  <div
    v-if="props.application"
    class="border-b border-gray-200 px-5 py-4"
  >
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="min-w-0">
        <h2 class="text-2xl font-semibold text-gray-900">
          {{ props.application.company }}
        </h2>

        <p class="mt-1 text-xl text-gray-500">
          {{ props.application.position }}
        </p>
      </div>

      <select
        :value="props.application.status"
        class="w-44 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        @change="updateApplicationStatus($event.target.value)"
      >
        <option
          v-for="status in props.applicationStatusOptions ?? []"
          :key="status"
          :value="status"
        >
          {{ status }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  application: {
    type: Object,
  },
  applicationStatusOptions: {
    type: Array,
  },
})

const emit = defineEmits(['update-application-status'])

function updateApplicationStatus(status) {
  emit('update-application-status', {
    applicationId: props.application.id,
    status,
  })
}
</script>