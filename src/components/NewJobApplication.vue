<template>
  <div>
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      @click="open = true"
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
      Add application
    </button>

    <dialog
      ref="applicationDialog"
      aria-labelledby="application-dialog-title"
      aria-describedby="application-dialog-description"
      class="w-[calc(100%-2rem)] max-w-lg rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
      @close="open = false"
    >
      <div class="border-b border-gray-200 px-5 py-4">
        <h3
          id="application-dialog-title"
          class="text-lg font-semibold text-gray-900"
        >
          Add job application
        </h3>

        <p
          id="application-dialog-description"
          class="mt-1 text-sm text-gray-500"
        >
          Enter the details of the job you're applying for.
        </p>
      </div>

      <div class="space-y-5 px-5 py-5">
        <div>
          <label
            for="company-name"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Company name
          </label>

          <input
            id="company-name"
            v-model="companyName"
            type="text"
            placeholder="e.g. Google, Microsoft, Amazon"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            for="position"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Position
          </label>

          <input
            id="position"
            v-model="position"
            type="text"
            placeholder="e.g. Backend Software Engineer"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            for="application-status"
            class="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Application status
          </label>

          <select
            id="application-status"
            v-model="status"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option disabled value="">
              Choose a status
            </option>

            <option
              v-for="option in props.applicationStatusOptions ?? []"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-3">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          @click="applicationDialog.close()"
        >
          Cancel
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="addNewApplication"
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
          Add application
        </button>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const emit = defineEmits(['add-new-application'])

const props = defineProps({
  applicationStatusOptions: {
    type: Array,
  },
})

const open = ref(false)

const companyName = ref('')
const position = ref('')
const status = ref('')
const applicationDialog = ref(null)

watch(open, async (visible) => {
  await nextTick()

  const element = applicationDialog.value

  if (!element) return

  if (visible && !element.open) {
    element.showModal()
  } else if (!visible && element.open) {
    element.close()
  }
})


function addNewApplication() {
  emit('add-new-application', {
    companyName: companyName.value.trim(),
    position: position.value.trim(),
    status: status.value,
  })

  companyName.value = ''
  position.value = ''
  status.value = ''

  open.value = false
}
</script>