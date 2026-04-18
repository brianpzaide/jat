<template>
  <div class="markdown-editor" v-if="application">
    <div class="toolbar">
      <button @click="togglePreview">
        {{ isPreview ? 'Edit' : 'Preview' }}
      </button>
      <button @click="save">💾 Save</button>
    </div>

    <div class="editor-container">
      <textarea
        v-if="!isPreview"
        ref="textarea"
        v-model="content"
        class="editor"
      ></textarea>

      <div
        v-else
        class="preview"
        v-html="compiledMarkdown"
      ></div>
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


const props = defineProps({
  application: Object
})
const content = ref('')
watch(
  () => props.application,
  (app) => {
    if (app) content.value = app.notes || ""
  },
  { immediate: true }
)


const isPreview = ref(false)
const textarea = ref(null)

marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code, ['python', 'go']).value
  }
})

const compiledMarkdown = computed(() =>
  DOMPurify.sanitize(marked.parse(content.value))
)


function togglePreview() {
  isPreview.value = !isPreview.value
}

const emit = defineEmits(['update-application-notes'])

function save() {
  emit('update-application-notes', {
  applicationId: props.application.id,
  notes: content.value
})
}
</script>

<style scoped>
.markdown-editor {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;

  border: 1px solid #d0d7de;
  border-radius: 6px;

  overflow: hidden;
}

.toolbar {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
}

.toolbar button {
  background: white;
  border: 1px solid #d0d7de;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

.toolbar button:hover {
  background: #f3f4f6;
}

.editor-container {
  flex: 1;
  min-height: 0;
  padding: 12px;
  display: flex;
  overflow: hidden;
}

.editor {
  flex: 1;
  min-height: 0;

  width: 100%;
  height: 100%;

  border: none;
  outline: none;
  resize: none;

  padding: 12px;
  font-family: monospace;
  line-height: 1.5;

  overflow-y: auto;
}

.preview {
  height: 100%;
  overflow-y: auto;
  line-height: 1.5;
}

.preview pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

.preview code {
  font-family: monospace;
}
</style>