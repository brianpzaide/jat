<template>
  <div
    v-if="props.application"
    class="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
  >
  
    <div class="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
      <div class="inline-flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          class="rounded-md px-3 py-1.5 text-sm font-medium transition"
          :class="!isPreview
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
          @click="isPreview = false"
        >
          Edit
        </button>

        <button
          type="button"
          class="rounded-md px-3 py-1.5 text-sm font-medium transition"
          :class="isPreview
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
          @click="isPreview = true"
        >
          Preview
        </button>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="save"
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
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
          <path d="M17 21v-8H7v8" />
          <path d="M7 3v5h8" />
        </svg>
        Save
      </button>
    </div>

    <div class="min-h-0 min-w-0 flex-1 overflow-hidden p-4">
      <textarea
        v-if="!isPreview"
        ref="textarea"
        v-model="content"
        class="h-full min-h-0 w-full resize-none overflow-y-auto rounded-md border border-gray-200 bg-white p-4 font-mono text-sm leading-6 text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        placeholder="Write your application notes in Markdown..."
        spellcheck="false"
      />

      <div
        v-else
        class="markdown-preview h-full overflow-y-auto px-2 py-1 text-sm leading-6 text-gray-800"
        v-html="compiledMarkdown"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'

import python from 'highlight.js/lib/languages/python'
import go from 'highlight.js/lib/languages/go'

import 'highlight.js/styles/github.css'

hljs.registerLanguage('python', python)
hljs.registerLanguage('go', go)

// Configure syntax highlighting using Marked's current renderer API.
marked.use({
  renderer: {
    code({ text, lang }) {
      const language = lang?.split(/\s+/)[0]

      let highlighted

      if (language && hljs.getLanguage(language)) {
        highlighted = hljs.highlight(text, {
          language,
        }).value
      } else {
        highlighted = hljs.highlightAuto(text, ['python', 'go']).value
      }

      return `<pre><code class="hljs">${highlighted}</code></pre>`
    },
  },
})

const props = defineProps({
  application: Object,
})

const emit = defineEmits(['update-application-notes'])

const content = ref('')
const isPreview = ref(true)
const textarea = ref(null)

watch(
  () => props.application,
  app => {
    if (app) {
      content.value = app.notes || ''
    }
  },
  { immediate: true }
)

const compiledMarkdown = computed(() =>
  DOMPurify.sanitize(marked.parse(content.value))
)

function save() {
  emit('update-application-notes', {
    applicationId: props.application.id,
    notes: content.value,
  })

  isPreview.value = true
}
</script>

<style scoped>
.markdown-preview {
  overflow-wrap: anywhere;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3),
.markdown-preview :deep(h4) {
  margin-top: 1.5em;
  margin-bottom: 0.6em;
  font-weight: 600;
  line-height: 1.3;
  color: #111827;
}

.markdown-preview :deep(h1) {
  font-size: 1.5rem;
}

.markdown-preview :deep(h2) {
  font-size: 1.25rem;
}

.markdown-preview :deep(h3) {
  font-size: 1.1rem;
}

.markdown-preview :deep(p) {
  margin: 0.75em 0;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin: 0.75em 0;
  padding-left: 1.5rem;
}

.markdown-preview :deep(ul) {
  list-style-type: disc;
}

.markdown-preview :deep(ol) {
  list-style-type: decimal;
}

.markdown-preview :deep(li) {
  margin: 0.25em 0;
}

.markdown-preview :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.markdown-preview :deep(blockquote) {
  margin: 1em 0;
  padding: 0.5rem 1rem;
  border-left: 3px solid #d1d5db;
  background: #f9fafb;
  color: #6b7280;
}

.markdown-preview :deep(pre) {
  margin: 1em 0;
  padding: 1rem;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
  font-size: 0.8rem;
  line-height: 1.5;
}

.markdown-preview :deep(code) {
  font-family: monospace;
}

.markdown-preview :deep(:not(pre) > code) {
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.85em;
}

.markdown-preview :deep(table) {
  width: 100%;
  margin: 1em 0;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.markdown-preview :deep(th) {
  background: #f9fafb;
  font-weight: 600;
}

.markdown-preview :deep(hr) {
  margin: 1.5em 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
}
</style>