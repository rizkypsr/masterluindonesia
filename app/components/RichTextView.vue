<script setup lang="ts">
import { Image } from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'

/**
 * Read-only renderer for admin-authored HTML (e.g. the topup payment
 * instructions). The server already sanitizes the markup; rendering through
 * Tiptap adds a second layer, because Tiptap only renders nodes that exist in
 * its schema — anything that ever slipped past the server has nowhere to run.
 */
const props = defineProps<{
  html: string
  /** Shown when `html` is empty. */
  fallbackText?: string
}>()

const editor = useEditor({
  content: props.html,
  editable: false,
  extensions: [
    StarterKit.configure({
      link: {
        openOnClick: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
      },
    }),
    Image,
  ],
  editorProps: {
    attributes: { class: 'rich-text focus:outline-none' },
  },
})

watch(
  () => props.html,
  (html) => {
    if (editor.value && html) editor.value.commands.setContent(html)
  },
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <EditorContent v-if="html" :editor="editor" />
  <p v-else-if="fallbackText" class="whitespace-pre-wrap">{{ fallbackText }}</p>
</template>

<style scoped>
:deep(.rich-text) > * {
  margin: 0 0 0.5rem;
}
:deep(.rich-text) > *:last-child {
  margin-bottom: 0;
}
:deep(.rich-text h1),
:deep(.rich-text h2),
:deep(.rich-text h3),
:deep(.rich-text h4),
:deep(.rich-text h5),
:deep(.rich-text h6) {
  font-weight: 600;
  line-height: 1.3;
}
:deep(.rich-text h1) { font-size: 1.25em; }
:deep(.rich-text h2) { font-size: 1.15em; }
:deep(.rich-text h3),
:deep(.rich-text h4),
:deep(.rich-text h5),
:deep(.rich-text h6) { font-size: 1.05em; }
:deep(.rich-text ul),
:deep(.rich-text ol) {
  padding-left: 1.25rem;
}
:deep(.rich-text ul) { list-style: disc; }
:deep(.rich-text ol) { list-style: decimal; }
:deep(.rich-text li) { margin: 0.15rem 0; }
:deep(.rich-text strong) { font-weight: 600; }
:deep(.rich-text a) {
  color: var(--color-primary, #c09637);
  text-decoration: underline;
  word-break: break-word;
}
:deep(.rich-text blockquote) {
  border-left: 3px solid var(--color-primary, #c09637);
  padding: 0.25rem 0.75rem;
  background: rgba(192, 150, 55, 0.08);
  border-radius: 0.375rem;
}
:deep(.rich-text code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}
:deep(.rich-text pre) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
:deep(.rich-text pre code) {
  background: transparent;
  padding: 0;
}
:deep(.rich-text img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
:deep(.rich-text hr) {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.dark :deep(.rich-text code),
.dark :deep(.rich-text pre) {
  background: rgba(255, 255, 255, 0.08);
}
.dark :deep(.rich-text hr) {
  border-top-color: rgba(255, 255, 255, 0.15);
}
</style>
