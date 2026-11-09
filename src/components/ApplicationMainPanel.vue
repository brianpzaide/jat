<template>
  <div class="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-4">
    <ApplicationDetails
      :application="props.application"
      :applicationStatusOptions="props.applicationStatusOptions"
      @update-application-status="forwardUpdateApplicationStatus"
    />

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <ApplicationNotes
        :application="props.application"
        @update-application-notes="forwardUpdateApplicationNotes"
      />
    </div>
  </div>
</template>

<script setup>
import ApplicationDetails from './ApplicationDetails.vue'
import ApplicationNotes from './ApplicationNotes.vue'

const props = defineProps({
  application: {
    type: Object,
  },
  applicationStatusOptions: {
    type: Array,
  },
})

const emit = defineEmits([
  'update-application-status',
  'update-application-notes',
])

function forwardUpdateApplicationStatus(payload) {
  emit('update-application-status', payload)
}

function forwardUpdateApplicationNotes(payload) {
  emit('update-application-notes', payload)
}
</script>