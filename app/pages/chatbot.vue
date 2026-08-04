<template>
  <div class="relative flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Header -->
    <header class="shrink-0 flex items-center gap-3 px-3 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <button
        class="p-2 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Kembali"
        @click="goBack"
      >
        <Icon name="mdi:arrow-left" class="w-6 h-6" />
      </button>
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <div class="w-9 h-9 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 shrink-0">
          <Icon name="mdi:robot-happy" class="w-5 h-5 text-black" />
        </div>
        <div class="min-w-0">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white truncate">MasterLu AI</h1>
          <span
            v-if="selectedCategory"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[12px] font-medium text-[#9a7400] dark:text-yellow-400 truncate max-w-full mt-0.5"
          >
            <Icon name="mdi:tag" class="w-3 h-3 shrink-0" />
            {{ selectedCategory.name }}
          </span>
        </div>
      </div>
      <button
        v-if="messages.length"
        class="p-2 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Obrolan baru"
        @click="newChat"
      >
        <Icon name="mdi:square-edit-outline" class="w-5 h-5" />
      </button>
      <button
        class="p-2 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Riwayat percakapan"
        @click="openDrawer"
      >
        <Icon name="mdi:history" class="w-5 h-5" />
      </button>
    </header>

    <!-- Live admin chat — takes priority over the balance/free bars. -->
    <div
      v-if="humanMode"
      class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/40"
    >
      <Icon name="mdi:account-tie" class="w-4 h-4 shrink-0 text-green-700 dark:text-green-400" />
      <span class="text-green-800 dark:text-green-300">Anda terhubung dengan admin.</span>
    </div>

    <!-- While questions are free, the balance is irrelevant — say so instead. -->
    <div
      v-else-if="balance && freeTier"
      class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/40"
    >
      <Icon name="mdi:gift-outline" class="w-4 h-4 shrink-0 text-green-700 dark:text-green-400" />
      <span class="text-green-800 dark:text-green-300">
        Semua pertanyaan sedang gratis — tanya sepuasnya.
      </span>
    </div>

    <!-- Balance / free-allowance bar -->
    <button
      v-else-if="balance"
      class="shrink-0 w-full flex items-center gap-1 px-3 py-1.5 text-sm text-secondary dark:text-gray-400 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
      @click="goToSaldo"
    >
      <Icon name="mdi:wallet-outline" class="w-3.5 h-3.5 shrink-0" />
      <span :class="balance.low_balance ? 'text-red-500 font-medium' : ''">
        {{ formatRp(balance.balance_rp) }}
      </span>
      <template v-if="freeLeft > 0">
        <span>·</span>
        <span>{{ freeLeft }} pertanyaan gratis</span>
      </template>
      <Icon name="mdi:chevron-right" class="w-4 h-4 shrink-0 ml-auto" />
    </button>

    <!-- Cheap mode notice (thin balance → answers drop chapter summaries) -->
    <div
      v-if="isAuthenticated && cheapMode && !outOfCredit && !freeTier"
      class="shrink-0 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/40"
    >
      <p class="text-sm text-yellow-800 dark:text-yellow-300">
        Saldo menipis — jawaban sementara tanpa ringkasan bab. Isi saldo untuk jawaban lengkap.
      </p>
    </div>

    <!-- Out of credit → topup CTA (top, so the FAB never covers it) -->
    <div
      v-if="isAuthenticated && outOfCredit"
      class="shrink-0 px-3 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/40 flex items-center gap-2"
    >
      <p class="flex-1 text-sm text-yellow-800 dark:text-yellow-300">
        Saldo habis dan jatah gratis hari ini sudah terpakai.
      </p>
      <button
        class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        @click="goToSaldo"
      >
        <Icon name="mdi:wallet-plus-outline" class="w-4 h-4" />
        Isi Saldo
      </button>
    </div>

    <!-- Messages -->
    <div ref="scrollEl" class="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-hide" @scroll="onScroll">
      <!-- Empty state -->
      <div v-if="!messages.length" class="min-h-full flex flex-col items-center justify-center text-center px-6 py-4">
        <div class="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 dark:bg-yellow-500/10 mb-4">
          <Icon name="mdi:robot-happy" class="w-9 h-9 text-primary dark:text-yellow-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Halo! 👋</h2>
        <p class="text-[16px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6 max-w-xs">
          {{ selectedCategory
            ? `Kategori "${selectedCategory.name}" dipilih. Ketik pertanyaan Anda di bawah.`
            : 'Pilih kategori untuk memulai percakapan.' }}
        </p>

        <ChatCategoryGrid
          class="w-full max-w-xs text-left"
          :categories="categories"
          :selected-id="selectedCategory?.id ?? null"
          :loading="loadingCategories"
          @select="(cat) => (selectedCategory = cat)"
        />
      </div>

      <!-- Message list -->
      <template v-for="message in messages" :key="message.id">
        <!-- User message -->
        <div v-if="message.role === 'user'" class="flex flex-col items-end">
          <div
            class="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-primary dark:bg-yellow-500 text-black leading-relaxed whitespace-pre-wrap break-words"
            :style="{ fontSize: fontSize + 'px' }"
          >
            {{ textOf(message) }}
          </div>
          <button
            class="mt-1 mr-1 flex items-center gap-1 text-sm text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 transition-colors"
            aria-label="Salin pesan"
            @click="copyMessage(message.id, textOf(message))"
          >
            <Icon :name="copiedId === message.id ? 'mdi:check' : 'mdi:content-copy'" class="w-3.5 h-3.5" />
            {{ copiedId === message.id ? 'Disalin' : 'Salin' }}
          </button>
        </div>

        <!-- Assistant message -->
        <div v-else class="flex gap-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 shrink-0 mt-0.5">
            <Icon name="mdi:robot-happy" class="w-4 h-4 text-black" />
          </div>
          <div class="max-w-[85%] space-y-1.5">
            <span
              v-if="isAdminReplyOf(message)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[12px] font-medium text-[#9a7400] dark:text-yellow-400"
            >
              <Icon name="mdi:account-check" class="w-3 h-3 shrink-0" />
              Dijawab Admin
            </span>
            <div
              class="px-4 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 leading-relaxed break-words"
              :style="{ fontSize: fontSize + 'px' }"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="textOf(message)" class="md-content" v-html="renderMarkdown(textOf(message))" />
              <span v-else class="inline-flex gap-1.5 py-1">
                <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 0ms" />
                <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 200ms" />
                <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 400ms" />
              </span>
            </div>

            <button
              v-if="textOf(message)"
              class="ml-1 flex items-center gap-1 text-sm text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 transition-colors"
              aria-label="Salin pesan"
              @click="copyMessage(message.id, textOf(message))"
            >
              <Icon :name="copiedId === message.id ? 'mdi:check' : 'mdi:content-copy'" class="w-3.5 h-3.5" />
              {{ copiedId === message.id ? 'Disalin' : 'Salin' }}
            </button>

            <!-- Sources -->
            <div v-if="sourcesOf(message).length" class="space-y-1.5">
              <p class="text-sm font-semibold uppercase tracking-wide text-secondary dark:text-gray-400 px-1">Artikel Terkait</p>
              <component
                :is="linkFor(src) ? resolveLinkComponent : 'div'"
                v-for="(src, i) in sourcesOf(message)"
                :key="`${src.content_type}-${src.content_id}-${src.segment_id ?? i}`"
                :to="linkFor(src)"
                class="block px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                :class="linkFor(src) ? 'hover:border-primary dark:hover:border-yellow-500 transition-colors' : ''"
              >
                <div class="flex items-start gap-2">
                  <Icon :name="iconFor(src.content_type)" class="w-4 h-4 text-primary dark:text-yellow-400 mt-0.5 shrink-0" />
                  <div class="min-w-0">
                    <p class="text-base font-medium text-gray-900 dark:text-white truncate">
                      {{ src.title || src.category_title || 'Sumber' }}
                    </p>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <p v-if="src.chapter_title || src.category_title" class="text-sm text-secondary dark:text-gray-400 truncate">
                        {{ src.chapter_title || src.category_title }}
                      </p>
                      <span
                        v-if="src.timestamp_formatted"
                        class="inline-flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[12px] font-medium text-[#9a7400] dark:text-yellow-400"
                      >
                        <Icon name="mdi:clock-outline" class="w-3 h-3" />
                        {{ src.timestamp_formatted }}
                      </span>
                    </div>
                    <p v-if="src.snippet" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {{ src.snippet }}
                    </p>
                  </div>
                </div>
              </component>
            </div>

            <!-- Suggested categories (fallback answer) -->
            <div v-if="suggestionsOf(message).length" class="space-y-1.5">
              <p class="text-sm font-semibold uppercase tracking-wide text-secondary dark:text-gray-400 px-1">
                Coba kategori lain
              </p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="cat in suggestionsOf(message)"
                  :key="cat.id"
                  :disabled="isBusy"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary/40 dark:border-yellow-500/40 bg-primary/10 dark:bg-yellow-500/10 text-[#9a7400] dark:text-yellow-400 text-sm font-medium hover:bg-primary/20 dark:hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                  @click="askSuggested(cat)"
                >
                  <Icon name="mdi:tag-outline" class="w-4 h-4 shrink-0" />
                  {{ cat.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Waiting for the bot's first response (before the stream starts) -->
      <div v-if="isWaiting" class="flex gap-2">
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 shrink-0 mt-0.5">
          <Icon name="mdi:robot-happy" class="w-4 h-4 text-black" />
        </div>
        <div class="px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <span class="flex gap-1.5">
            <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 0ms" />
            <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 200ms" />
            <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 400ms" />
          </span>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="flex gap-2">
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/40 shrink-0 mt-0.5">
          <Icon name="mdi:alert" class="w-4 h-4 text-red-500" />
        </div>
        <div class="max-w-[85%]">
          <div class="px-4 py-2.5 rounded-2xl rounded-bl-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 text-base">
            {{ errorMessage }}
          </div>
          <button class="mt-1 text-sm text-primary dark:text-yellow-400 font-medium px-1" @click="retry">
            Coba lagi
          </button>
        </div>
      </div>
      <!-- Scroll to bottom -->
      <div class="sticky bottom-2 z-10 flex justify-start pointer-events-none">
        <Transition name="fade">
          <button
            v-if="showScrollBtn"
            class="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400 transition-colors"
            aria-label="Gulir ke bawah"
            @click="scrollToBottom('smooth')"
          >
            <Icon name="mdi:chevron-down" class="w-6 h-6" />
          </button>
        </Transition>
      </div>
    </div>

    <!-- Not authenticated notice -->
    <div v-if="!isAuthenticated" class="shrink-0 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-900/40">
      <p class="text-sm text-yellow-800 dark:text-yellow-300 text-center">
        Silakan masuk terlebih dahulu untuk menggunakan chatbot.
      </p>
    </div>

    <!-- Input bar -->
    <div class="shrink-0 relative px-3 py-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <!-- Floating zoom / scroll tools (above the input bar) -->
      <LazyFabZoom
        v-model:isOpen="isToolsExpanded"
        class="absolute right-0 bottom-full z-20"
        @zoomIn="zoomIn"
        @zoomOut="zoomOut"
        @scrollTop="scrollToTop"
      />
      <div class="flex items-end gap-2">
        <textarea
          ref="inputEl"
          v-model="input"
          rows="1"
          :disabled="!isAuthenticated || (outOfCredit && !humanMode)"
          :placeholder="humanMode ? 'Tulis pesan ke admin...' : (outOfCredit ? 'Saldo habis' : 'Tulis pertanyaan...')"
          class="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-yellow-500 disabled:opacity-60"
          @input="autoGrow"
          @keydown="onKeydown"
        />
        <button
          v-if="isBusy"
          class="w-11 h-11 shrink-0 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          aria-label="Hentikan"
          @click="chat.stop()"
        >
          <Icon name="mdi:stop" class="w-5 h-5" />
        </button>
        <button
          v-else
          :disabled="!canSend"
          class="w-11 h-11 shrink-0 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 text-black transition-opacity disabled:opacity-40"
          aria-label="Kirim"
          @click="send"
        >
          <Icon name="mdi:send" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Conversations drawer -->
    <Transition name="fade">
      <div
        v-if="drawerOpen"
        class="absolute inset-0 z-30 bg-black/40"
        @click="drawerOpen = false"
      />
    </Transition>
    <Transition name="slide">
      <aside
        v-if="drawerOpen"
        class="absolute inset-y-0 left-0 z-40 w-[82%] max-w-xs bg-white dark:bg-gray-800 shadow-xl flex flex-col"
      >
        <div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Riwayat</h2>
          <div class="flex items-center">
            <button
              class="p-2 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Kelola grup"
              @click="openGroupManager"
            >
              <Icon name="mdi:folder-cog-outline" class="w-5 h-5" />
            </button>
            <button
              class="p-2 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Tutup"
              @click="drawerOpen = false"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="shrink-0 px-3 py-3">
          <button
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary dark:bg-yellow-500 text-black text-base font-medium transition-opacity hover:opacity-90"
            @click="startNewChat"
          >
            <Icon name="mdi:plus" class="w-5 h-5" />
            Obrolan Baru
          </button>
          <p v-if="conversationsTotal" class="text-sm text-secondary dark:text-gray-400 text-center mt-2">
            {{ conversationsTotal }} percakapan
          </p>
        </div>

        <div class="flex-1 overflow-y-auto px-3 pb-4 scrollbar-hide" @scroll.passive="onDrawerScroll">
          <div v-if="loadingList" class="py-8 text-center">
            <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
          </div>
          <p v-else-if="!conversations.length" class="py-8 text-center text-base text-secondary dark:text-gray-400">
            Belum ada percakapan.
          </p>
          <template v-else>
            <!-- One section per group, then the ungrouped tail -->
            <div v-for="section in conversationSections.sections" :key="section.group.id" class="mb-1">
              <button
                class="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="toggleGroupCollapsed(section.group.id)"
              >
                <Icon
                  name="mdi:chevron-down"
                  class="w-4 h-4 shrink-0 transition-transform"
                  :class="collapsedGroups.has(section.group.id) ? '-rotate-90' : ''"
                />
                <Icon name="mdi:folder-outline" class="w-4 h-4 shrink-0 text-primary dark:text-yellow-400" />
                <span class="text-sm font-semibold uppercase tracking-wide truncate">{{ section.group.name }}</span>
                <span class="text-sm ml-auto shrink-0">{{ section.group.conversation_count }}</span>
              </button>

              <ul v-if="!collapsedGroups.has(section.group.id)" class="space-y-1 pl-2">
                <ConversationRow
                  v-for="c in section.items"
                  :key="c.id"
                  :conversation="c"
                  :active="c.id === conversationId"
                  :editing="renamingId === c.id"
                  :saving="savingTitle"
                  @select="selectConversation(c.id)"
                  @rename="startRenameConversation(c)"
                  @submit-rename="(title) => submitRenameConversation(c.id, title)"
                  @cancel-rename="cancelRenameConversation"
                  @move="openMoveSheet(c)"
                  @remove="confirmDelete(c)"
                />
                <li
                  v-if="!section.items.length"
                  class="px-3 py-2 text-sm text-secondary dark:text-gray-400"
                >
                  {{ section.group.conversation_count
                    ? 'Belum termuat — gulir untuk memuat lebih banyak.'
                    : 'Grup masih kosong.' }}
                </li>
              </ul>
            </div>

            <div v-if="conversationSections.ungrouped.length">
              <p
                v-if="conversationSections.sections.length"
                class="px-2 py-1.5 text-sm font-semibold uppercase tracking-wide text-secondary dark:text-gray-400"
              >
                Tanpa grup
              </p>
              <ul class="space-y-1">
                <ConversationRow
                  v-for="c in conversationSections.ungrouped"
                  :key="c.id"
                  :conversation="c"
                  :active="c.id === conversationId"
                  :editing="renamingId === c.id"
                  :saving="savingTitle"
                  @select="selectConversation(c.id)"
                  @rename="startRenameConversation(c)"
                  @submit-rename="(title) => submitRenameConversation(c.id, title)"
                  @cancel-rename="cancelRenameConversation"
                  @move="openMoveSheet(c)"
                  @remove="confirmDelete(c)"
                />
              </ul>
            </div>
          </template>

          <!-- Lazy-load sentinel: scrolling this into view fetches the next page -->
          <div v-if="!loadingList && hasMoreConversations" class="py-4 text-center">
            <Icon
              v-if="loadingMoreList"
              name="mdi:loading"
              class="w-5 h-5 text-secondary dark:text-gray-400 animate-spin"
            />
            <button
              v-else
              class="text-sm text-primary dark:text-yellow-400 font-medium"
              @click="loadMoreConversations"
            >
              Muat lebih banyak
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Group manager -->
    <Transition name="fade">
      <div
        v-if="showGroupManager"
        class="absolute inset-0 z-50 bg-black/40 flex items-end"
        @click.self="showGroupManager = false"
      >
        <Transition name="sheet" appear>
          <div class="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Kelola grup</h3>
              <button
                class="p-1 -mr-1 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Tutup"
                @click="showGroupManager = false"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-secondary dark:text-gray-400 mb-3">
              Grup hanya untuk merapikan riwayat Anda. Menghapus grup tidak menghapus percakapan.
            </p>

            <div class="flex gap-2 mb-3">
              <input
                v-model="newGroupName"
                type="text"
                maxlength="100"
                placeholder="Nama grup baru"
                class="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-yellow-500"
                @keydown.enter.prevent="submitNewGroup"
              />
              <button
                :disabled="!newGroupName.trim() || creatingGroup"
                class="shrink-0 px-4 py-2.5 rounded-xl bg-primary dark:bg-yellow-500 text-black text-base font-medium transition-opacity disabled:opacity-40"
                @click="submitNewGroup"
              >
                Tambah
              </button>
            </div>

            <div v-if="loadingGroups" class="py-6 text-center">
              <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
            </div>
            <p v-else-if="!groups.length" class="py-6 text-center text-base text-secondary dark:text-gray-400">
              Belum ada grup.
            </p>
            <ul v-else class="max-h-[45vh] overflow-y-auto scrollbar-hide space-y-1">
              <li
                v-for="g in groups"
                :key="g.id"
                class="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <template v-if="editingGroupId === g.id">
                  <input
                    v-model="editingGroupName"
                    type="text"
                    maxlength="100"
                    class="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-yellow-500"
                    @keydown.enter.prevent="saveGroupName"
                    @keydown.esc="cancelRenameGroup"
                  />
                  <button
                    :disabled="!editingGroupName.trim() || savingGroup"
                    class="shrink-0 p-1.5 inline-flex items-center justify-center rounded-full text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 disabled:opacity-40"
                    aria-label="Simpan"
                    @click="saveGroupName"
                  >
                    <Icon name="mdi:check" class="w-5 h-5" />
                  </button>
                  <button
                    class="shrink-0 p-1.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Batal"
                    @click="cancelRenameGroup"
                  >
                    <Icon name="mdi:close" class="w-5 h-5" />
                  </button>
                </template>
                <template v-else>
                  <Icon name="mdi:folder-outline" class="w-5 h-5 shrink-0 text-primary dark:text-yellow-400" />
                  <div class="min-w-0 flex-1">
                    <p class="text-base text-gray-900 dark:text-white truncate">{{ g.name }}</p>
                    <p class="text-sm text-secondary dark:text-gray-400">
                      {{ g.conversation_count }} percakapan
                    </p>
                  </div>
                  <button
                    class="shrink-0 p-1.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 hover:bg-primary/10 dark:hover:bg-yellow-500/10"
                    aria-label="Ubah nama"
                    @click="startRenameGroup(g)"
                  >
                    <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                  </button>
                  <button
                    class="shrink-0 p-1.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                    aria-label="Hapus grup"
                    @click="removeGroup(g)"
                  >
                    <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                  </button>
                </template>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Move conversation to a group -->
    <Transition name="fade">
      <div
        v-if="movingConversation"
        class="absolute inset-0 z-50 bg-black/40 flex items-end"
        @click.self="movingConversation = null"
      >
        <Transition name="sheet" appear>
          <div class="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pindahkan ke grup</h3>
              <button
                class="p-1 -mr-1 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Tutup"
                @click="movingConversation = null"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-secondary dark:text-gray-400 mb-3 truncate">
              "{{ movingConversation.title || 'Tanpa judul' }}"
            </p>

            <div class="max-h-[45vh] overflow-y-auto scrollbar-hide space-y-1">
              <button
                v-for="g in groups"
                :key="g.id"
                :disabled="movingToGroup"
                class="w-full flex items-center gap-2 px-3 py-3 rounded-xl border text-left transition-colors disabled:opacity-50"
                :class="movingConversation.group?.id === g.id
                  ? 'border-primary dark:border-yellow-500 bg-primary/10 dark:bg-yellow-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-yellow-500'"
                @click="moveToGroup(g.id)"
              >
                <Icon name="mdi:folder-outline" class="w-5 h-5 shrink-0 text-primary dark:text-yellow-400" />
                <span class="text-base text-gray-900 dark:text-white truncate">{{ g.name }}</span>
                <Icon
                  v-if="movingConversation.group?.id === g.id"
                  name="mdi:check"
                  class="w-5 h-5 shrink-0 ml-auto text-primary dark:text-yellow-400"
                />
              </button>

              <button
                :disabled="movingToGroup"
                class="w-full flex items-center gap-2 px-3 py-3 rounded-xl border text-left transition-colors disabled:opacity-50"
                :class="!movingConversation.group
                  ? 'border-primary dark:border-yellow-500 bg-primary/10 dark:bg-yellow-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-yellow-500'"
                @click="moveToGroup(null)"
              >
                <Icon name="mdi:folder-off-outline" class="w-5 h-5 shrink-0 text-secondary dark:text-gray-400" />
                <span class="text-base text-gray-900 dark:text-white">Tanpa grup</span>
                <Icon
                  v-if="!movingConversation.group"
                  name="mdi:check"
                  class="w-5 h-5 shrink-0 ml-auto text-primary dark:text-yellow-400"
                />
              </button>

              <p v-if="!groups.length" class="py-4 text-center text-base text-secondary dark:text-gray-400">
                Belum ada grup. Buat dulu lewat ikon folder di atas.
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Category picker (first-message gate) -->
    <Transition name="fade">
      <div
        v-if="showCategoryPicker"
        class="absolute inset-0 z-40 bg-black/40 flex items-end"
        @click.self="cancelCategoryPicker"
      >
        <Transition name="sheet" appear>
          <div class="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pilih kategori pertanyaan</h3>
              <button
                class="p-1 -mr-1 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Batal"
                @click="cancelCategoryPicker"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-secondary dark:text-gray-400 mb-3">
              Kategori menentukan sumber jawaban dan tidak bisa diubah setelah percakapan dimulai.
            </p>

            <p
              v-if="pendingMessage"
              class="text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/60 rounded-xl px-3 py-2 mb-3 line-clamp-2"
            >
              "{{ pendingMessage }}"
            </p>

            <div class="max-h-[55vh] overflow-y-auto scrollbar-hide">
              <ChatCategoryGrid
                :categories="categories"
                :loading="loadingCategories"
                @select="pickCategory"
              />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { marked } from 'marked'
import { NuxtLink } from '#components'
import { useAuth } from '~/lib/auth'
import {
  useChatApi,
  type CategoryRef,
  type ChatCategory,
  type ConversationGroup,
  type ConversationListItem,
} from '~/composables/useChatApi'
import { useDepositApi, formatRp, type DepositBalance } from '~/composables/useDepositApi'
import {
  createMasterLuChatTransport,
  type BillingError,
  type ChatContentType,
  type ChatSource,
  type MasterLuUIMessage,
  type SuggestedCategory,
} from '~/lib/chatTransport'
import { subscribeConversationStream, type LiveMessage } from '~/lib/sseClient'

const config = useRuntimeConfig()
const router = useRouter()
const toast = useToast()
const { getAuthHeader, isAuthenticated } = useAuth()
const chatApi = useChatApi()
const depositApi = useDepositApi()

const resolveLinkComponent = NuxtLink

marked.setOptions({ gfm: true, breaks: true })

const conversationId = ref<number | undefined>(undefined)
const input = ref('')
const scrollEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const copiedId = ref<string | null>(null)

// Live human takeover: when an admin claims the conversation, the AI pauses and
// replies arrive over an SSE channel instead.
const humanMode = ref(false)
let liveSub: { close: () => void } | null = null
// Highest server message id seen — sent as `after_id` so a reconnect backfills
// anything pushed while the stream was down.
let lastLiveId = 0

// Conversation history (drawer). Paginated — the list can reach a few hundred.
const CONVERSATION_PAGE_SIZE = 20
const drawerOpen = ref(false)
const conversations = ref<ConversationListItem[]>([])
const loadingList = ref(false)
const loadingMoreList = ref(false)
const conversationsPage = ref(1)
const conversationsTotal = ref(0)

const hasMoreConversations = computed(
  () => conversations.value.length < conversationsTotal.value,
)

// Conversation groups (user-owned folders over the history)
const groups = ref<ConversationGroup[]>([])
const loadingGroups = ref(false)
const collapsedGroups = ref<Set<number>>(new Set())
// Group manager sheet
const showGroupManager = ref(false)
const newGroupName = ref('')
const creatingGroup = ref(false)
const editingGroupId = ref<number | null>(null)
const editingGroupName = ref('')
const savingGroup = ref(false)
// Move-to-group sheet — the conversation being moved, or null when closed.
const movingConversation = ref<ConversationListItem | null>(null)
const movingToGroup = ref(false)
// Inline title rename — the conversation being renamed, or null when idle.
const renamingId = ref<number | null>(null)
const savingTitle = ref(false)

/**
 * Split the loaded conversations into one section per group plus an ungrouped
 * tail. Only covers what's been paged in so far — each header also shows the
 * server's own `conversation_count` so a partially loaded group is obvious.
 */
const conversationSections = computed(() => {
  const sections = groups.value.map((group) => ({
    group,
    items: [] as ConversationListItem[],
  }))
  const byGroupId = new Map(sections.map((s) => [s.group.id, s]))
  const ungrouped: ConversationListItem[] = []

  for (const c of conversations.value) {
    const section = c.group ? byGroupId.get(c.group.id) : undefined
    if (section) section.items.push(c)
    else ungrouped.push(c)
  }
  return { sections, ungrouped }
})

// Categories (first-message gate)
const categories = ref<ChatCategory[]>([])
const selectedCategory = ref<CategoryRef | null>(null)
const pendingMessage = ref('')
const showCategoryPicker = ref(false)
const loadingCategories = ref(false)

// Deposit balance + daily free allowance
const balance = ref<DepositBalance | null>(null)
/** Cheap mode (no chapter summaries) kicked in on the last answer. */
const cheapMode = ref(false)

const freeLeft = computed(() => balance.value?.free.remaining ?? 0)
const balanceMrp = computed(() => balance.value?.balance_mrp ?? 0)
/** The model is free at the provider — nothing is charged, hide the balance UI. */
const freeTier = computed(() => balance.value?.free_tier ?? false)
/** No free question left AND no money — the next question would be refused. */
const outOfCredit = computed(
  () => !freeTier.value && balance.value != null && freeLeft.value <= 0 && balanceMrp.value <= 0,
)

// Zoom / scroll tools (FabZoom)
const isToolsExpanded = ref(false)
const fontSize = ref(17)

function zoomIn() {
  fontSize.value = Math.min(fontSize.value + 2, 28)
}

function zoomOut() {
  fontSize.value = Math.max(fontSize.value - 2, 12)
}

function scrollToTop() {
  scrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const chat = new Chat<MasterLuUIMessage>({
  transport: createMasterLuChatTransport({
    apiBaseUrl: config.public.apiV2BaseUrl,
    getAuthHeader: () => getAuthHeader() as Record<string, string>,
    getConversationId: () => conversationId.value,
    getCategoryId: () => selectedCategory.value?.id,
    onMeta: (meta) => {
      const isNew = !conversationId.value
      if (meta?.conversation_id) conversationId.value = meta.conversation_id
      // A brand-new conversation just got an id → refresh the sidebar list.
      if (isNew) refreshConversations()

      // `billing.balance_mrp` is the balance AFTER the deduction — apply it
      // directly instead of refetching /balance.
      const billing = meta?.billing
      if (billing && balance.value) {
        cheapMode.value = billing.mode === 'cheap'
        const free = balance.value.free
        const usedFree = billing.source === 'free'
        balance.value = {
          ...balance.value,
          balance_mrp: billing.balance_mrp,
          balance_rp: Math.floor(billing.balance_mrp / 1000),
          free: usedFree
            ? { ...free, used: free.used + 1, remaining: Math.max(free.remaining - 1, 0) }
            : free,
        }
      } else if (billing) {
        fetchBalance()
      }
    },
    onHttpError: handleHttpError,
    onBilling: (b) => {
      if (b.mode) cheapMode.value = b.mode === 'cheap'
      // Headers carry the balance BEFORE the deduction, so only trust them to
      // seed the free counter when we have nothing cached yet.
      if (!balance.value) fetchBalance()
    },
    onNeedsCategory: (cats) => {
      // Defensive: server still wants a category — re-open the picker.
      if (Array.isArray(cats) && cats.length) categories.value = cats as ChatCategory[]
      showCategoryPicker.value = true
    },
    onHumanMode: (convId) => {
      // An admin just took over mid-conversation. Switch to live mode, resync
      // (removes the optimistic user bubble AI SDK added) and open the channel.
      enterHumanMode(convId)
    },
  }),
})

function handleHttpError(
  status: number,
  message: string,
  extra?: BillingError & { retryAfterSeconds?: number },
) {
  if (status === 409) {
    toast.add({
      title: 'Batas percakapan tercapai',
      description: 'Maksimal 3 percakapan. Hapus salah satu untuk memulai obrolan baru.',
      color: 'error',
    })
    openDrawer()
  } else if (status === 402 || extra?.code === 'insufficient_balance') {
    // Balance empty and today's free question already used.
    applyDepletedBalance(extra)
    toast.add({
      title: 'Saldo habis',
      description: message,
      color: 'warning',
      actions: [{ label: 'Isi Saldo', onClick: goToSaldo }],
    })
  } else if (extra?.code === 'free_limit_reached') {
    // App-wide free pool exhausted — only hits users with a zero balance.
    applyDepletedBalance(extra)
    toast.add({
      title: 'Kuota gratis hari ini habis',
      description: message,
      color: 'warning',
      actions: [{ label: 'Isi Saldo', onClick: goToSaldo }],
    })
  } else if (extra?.code === 'request_in_progress') {
    toast.add({
      title: 'Masih memproses',
      description: message,
      color: 'warning',
    })
  } else if (status === 429) {
    toast.add({
      title: 'Terlalu banyak permintaan',
      description: extra?.retryAfterSeconds
        ? `Coba lagi dalam ${extra.retryAfterSeconds} detik.`
        : 'Mohon tunggu sebentar lalu coba lagi.',
      color: 'warning',
    })
  } else if (status === 400) {
    toast.add({
      title: 'Kategori tidak valid',
      description: 'Silakan pilih kategori lagi.',
      color: 'error',
    })
    // Re-fetch categories and ask again.
    selectedCategory.value = null
    ensureCategories(true)
    showCategoryPicker.value = true
  } else if (status === 401) {
    toast.add({
      title: 'Sesi berakhir',
      description: 'Silakan masuk kembali untuk melanjutkan.',
      color: 'error',
    })
  } else if (status === 413) {
    toast.add({ title: 'Pesan terlalu panjang', description: 'Maksimal 2000 karakter.', color: 'error' })
  } else if (status === 503 || status === 502 || status === 504) {
    // The AI provider is throttling or down. Nothing was charged and the free
    // question is refunded, so say that — otherwise it reads like lost money.
    errorHint.value = BUSY_HINT
    toast.add({
      title: 'Layanan sedang sibuk',
      description: `${BUSY_HINT} Saldo Anda tidak terpotong.`,
      color: 'warning',
    })
  }
}

const BUSY_HINT =
  'Layanan AI sedang ramai dan membatasi permintaan. Tunggu sebentar lalu coba lagi.'

/**
 * A friendlier replacement for the raw error text in the inline bubble. Set from
 * `handleHttpError`, or inferred from a mid-stream `error` event (which carries
 * no HTTP status) when the wording points at throttling or an overloaded model.
 */
const errorHint = ref<string | null>(null)

function looksLikeThrottling(message: string): boolean {
  return /rate.?limit|quota|overload|too many|unavailable|busy|503|429/i.test(message)
}

const errorMessage = computed(() => {
  if (errorHint.value) return errorHint.value
  const raw = error.value?.message ?? ''
  if (raw && looksLikeThrottling(raw)) return BUSY_HINT
  return raw || 'Terjadi kesalahan. Coba lagi.'
})

const messages = computed(() => chat.messages)
const status = computed(() => chat.status)
const error = computed(() => chat.error)
const isBusy = computed(() => status.value === 'submitted' || status.value === 'streaming')
// Show a standalone typing bubble while awaiting the first response chunk.
const isWaiting = computed(() => status.value === 'submitted')
const canSend = computed(
  () =>
    isAuthenticated.value &&
    !!input.value.trim() &&
    !isBusy.value &&
    // Live admin chat isn't billed, so credit doesn't gate it.
    (humanMode.value || !outOfCredit.value),
)

function textOf(message: MasterLuUIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function sourcesOf(message: MasterLuUIMessage): ChatSource[] {
  if (message.role !== 'assistant') return []
  const part = message.parts.find((p) => p.type === 'data-sources')
  return part && part.type === 'data-sources' ? part.data.books : []
}

/** Whether a persisted assistant answer was written manually by an admin. */
function isAdminReplyOf(message: MasterLuUIMessage): boolean {
  if (message.role !== 'assistant') return false
  const part = message.parts.find((p) => p.type === 'data-sources')
  return part && part.type === 'data-sources' ? !!part.data.isAdminReply : false
}

/** Recommended categories shown under a fallback (grounded: false) answer. */
function suggestionsOf(message: MasterLuUIMessage): SuggestedCategory[] {
  if (message.role !== 'assistant') return []
  const part = message.parts.find((p) => p.type === 'data-sources')
  return part && part.type === 'data-sources' ? (part.data.suggestedCategories ?? []) : []
}

/**
 * Start a fresh conversation scoped to a suggested category. We DON'T resend the
 * old question — the user types a new prompt themselves; we just preselect the
 * category and focus the input.
 */
function askSuggested(cat: SuggestedCategory) {
  if (isBusy.value) chat.stop()
  stopLiveStream()
  humanMode.value = false
  lastLiveId = 0
  chat.messages = []
  conversationId.value = undefined
  selectedCategory.value = { id: cat.id, name: cat.name }
  pendingMessage.value = ''
  errorHint.value = null
  nextTick(() => inputEl.value?.focus())
}

const ICON_BY_TYPE: Record<ChatContentType, string> = {
  book: 'mdi:book-open-variant',
  topics2: 'mdi:lightbulb-on-outline',
  topics3: 'mdi:comment-question-outline',
  audio: 'mdi:music-note',
  video: 'mdi:play-box',
}

// Build the frontend deep-link for a source. Each content type has its own
// route shape and uses content_id / segment_id / title differently.
function linkFor(src: ChatSource): string | undefined {
  switch (src.content_type) {
    case 'audio':
      return src.content_id
        ? `/audio/detail?audio_id=${src.content_id}${src.segment_id ? `&subtitle_id=${src.segment_id}` : ''}`
        : undefined
    case 'book':
      return src.segment_id ? `/book/${src.segment_id}` : undefined
    case 'video':
      return src.content_id
        ? `/video/play/${src.content_id}${src.title ? `?title=${encodeURIComponent(src.title)}` : ''}`
        : undefined
    case 'topics2':
      return src.segment_id ? `/topics2/content/${src.segment_id}` : undefined
    case 'topics3':
      return src.segment_id ? `/topics3/content/${src.segment_id}` : undefined
    default:
      return undefined
  }
}

function iconFor(type: ChatContentType): string {
  return ICON_BY_TYPE[type] ?? 'mdi:book-open-variant'
}

function renderMarkdown(text: string): string {
  return marked.parse(text, { async: false }) as string
}

// Convert Markdown to WhatsApp's own lightweight formatting so pasted text
// looks right there (WA doesn't render Markdown): bold markers collapse to
// single asterisks, headings become a bold line, links become "text (url)",
// inline code/strikethrough markers are stripped, list markers normalize to "- ".
function toWhatsAppText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/__(.+?)__/g, '*$1*')
    .replace(/^#{1,6}\s+(.*)$/gm, '*$1*')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)')
    .replace(/~~(.+?)~~/g, '~$1~')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/^\s*[*+]\s+/gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function copyMessage(id: string, text: string) {
  const formatted = toWhatsAppText(text)
  try {
    await navigator.clipboard.writeText(formatted)
  } catch {
    toast.add({ title: 'Gagal menyalin pesan', color: 'error' })
    return
  }
  copiedId.value = id
  setTimeout(() => {
    if (copiedId.value === id) copiedId.value = null
  }, 1500)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Conversation history ────────────────────────────────────────────────────

function openDrawer() {
  drawerOpen.value = true
  renamingId.value = null
  refreshConversations()
  refreshGroups()
}

// ── Conversation groups ─────────────────────────────────────────────────────

async function refreshGroups() {
  if (!isAuthenticated.value) return
  loadingGroups.value = true
  try {
    groups.value = await chatApi.listGroups()
  } catch {
    /* keep whatever we have; the list just renders as ungrouped */
  } finally {
    loadingGroups.value = false
  }
}

function toggleGroupCollapsed(id: number) {
  const next = new Set(collapsedGroups.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  collapsedGroups.value = next
}

function openGroupManager() {
  newGroupName.value = ''
  editingGroupId.value = null
  showGroupManager.value = true
  refreshGroups()
}

async function submitNewGroup() {
  const name = newGroupName.value.trim()
  if (!name || creatingGroup.value) return

  creatingGroup.value = true
  try {
    groups.value = [...groups.value, await chatApi.createGroup(name)]
    newGroupName.value = ''
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode
    toast.add({
      title: status === 409 ? 'Batas grup tercapai' : 'Gagal membuat grup',
      description:
        status === 409
          ? 'Hapus salah satu grup sebelum membuat yang baru.'
          : e?.data?.message,
      color: 'error',
    })
  } finally {
    creatingGroup.value = false
  }
}

function startRenameGroup(g: ConversationGroup) {
  editingGroupId.value = g.id
  editingGroupName.value = g.name
}

function cancelRenameGroup() {
  editingGroupId.value = null
  editingGroupName.value = ''
}

async function saveGroupName() {
  const id = editingGroupId.value
  const name = editingGroupName.value.trim()
  if (id == null || !name || savingGroup.value) return

  savingGroup.value = true
  try {
    await chatApi.updateGroup(id, { name })
    groups.value = groups.value.map((g) => (g.id === id ? { ...g, name } : g))
    // Keep the badges on already-loaded rows in sync with the new name.
    conversations.value = conversations.value.map((c) =>
      c.group?.id === id ? { ...c, group: { ...c.group, name } } : c,
    )
    cancelRenameGroup()
  } catch (e: any) {
    toast.add({ title: 'Gagal mengubah nama grup', description: e?.data?.message, color: 'error' })
  } finally {
    savingGroup.value = false
  }
}

async function removeGroup(g: ConversationGroup) {
  if (!window.confirm(`Hapus grup "${g.name}"? Percakapan di dalamnya tidak akan terhapus.`)) return
  try {
    await chatApi.deleteGroup(g.id)
    groups.value = groups.value.filter((x) => x.id !== g.id)
    // The server ungroups them rather than deleting — mirror that locally.
    conversations.value = conversations.value.map((c) =>
      c.group?.id === g.id ? { ...c, group: null } : c,
    )
  } catch {
    toast.add({ title: 'Gagal menghapus grup', color: 'error' })
  }
}

function openMoveSheet(c: ConversationListItem) {
  movingConversation.value = c
}

function startRenameConversation(c: ConversationListItem) {
  renamingId.value = c.id
}

function cancelRenameConversation() {
  renamingId.value = null
}

async function submitRenameConversation(id: number, title: string) {
  if (savingTitle.value) return

  savingTitle.value = true
  try {
    const data = await chatApi.renameConversation(id, title)
    conversations.value = conversations.value.map((c) =>
      c.id === id ? { ...c, title: data.title, updated_at: data.updated_at } : c,
    )
    renamingId.value = null
  } catch (e: any) {
    toast.add({ title: 'Gagal mengubah judul', description: e?.data?.message, color: 'error' })
  } finally {
    savingTitle.value = false
  }
}

async function moveToGroup(groupId: number | null) {
  const c = movingConversation.value
  if (!c || movingToGroup.value) return

  movingToGroup.value = true
  try {
    const data = await chatApi.setConversationGroup(c.id, groupId)
    conversations.value = conversations.value.map((x) =>
      x.id === c.id ? { ...x, group: data.group } : x,
    )
    // Counts shifted on both the old and the new group.
    refreshGroups()
    movingConversation.value = null
  } catch (e: any) {
    toast.add({ title: 'Gagal memindahkan percakapan', description: e?.data?.message, color: 'error' })
  } finally {
    movingToGroup.value = false
  }
}

/** Reload from page 1. Later pages are appended lazily as the drawer scrolls. */
async function refreshConversations() {
  if (!isAuthenticated.value) return
  loadingList.value = true
  try {
    const data = await chatApi.listConversations(1, CONVERSATION_PAGE_SIZE)
    conversations.value = data.conversations ?? []
    conversationsTotal.value = data.total ?? conversations.value.length
    conversationsPage.value = 1
  } catch {
    /* keep existing list on failure */
  } finally {
    loadingList.value = false
  }
}

/** Append the next page. The history can reach a few hundred rows. */
async function loadMoreConversations() {
  if (!isAuthenticated.value || loadingList.value || loadingMoreList.value) return
  if (!hasMoreConversations.value) return

  loadingMoreList.value = true
  try {
    const next = conversationsPage.value + 1
    const data = await chatApi.listConversations(next, CONVERSATION_PAGE_SIZE)
    const incoming = data.conversations ?? []
    // Guard against duplicates if a conversation moved between pages.
    const seen = new Set(conversations.value.map((c) => c.id))
    conversations.value = [...conversations.value, ...incoming.filter((c) => !seen.has(c.id))]
    conversationsTotal.value = data.total ?? conversationsTotal.value
    conversationsPage.value = next
    // A short page means the server has nothing left, regardless of `total`.
    if (!incoming.length) conversationsTotal.value = conversations.value.length
  } catch {
    /* keep what we have; the sentinel stays so the user can scroll again */
  } finally {
    loadingMoreList.value = false
  }
}

/** Load the next page once the sentinel near the list bottom comes into view. */
function onDrawerScroll(e: Event) {
  const el = e.target as HTMLElement
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) loadMoreConversations()
}

/** Convert persisted conversation messages into AI SDK UI messages. */
function toUiMessages(
  records: Awaited<ReturnType<typeof chatApi.getConversation>>['messages'],
): MasterLuUIMessage[] {
  return records.map((m) => {
    const parts: MasterLuUIMessage['parts'] = [{ type: 'text', text: m.content }]
    if (
      m.role === 'assistant' &&
      (m.books?.length || m.is_admin_reply || m.suggested_categories?.length)
    ) {
      parts.push({
        type: 'data-sources',
        id: 'sources',
        data: {
          books: m.books ?? [],
          grounded: true,
          suggestedCategories: m.suggested_categories ?? [],
          isAdminReply: m.is_admin_reply ?? false,
        },
      })
    }
    return { id: String(m.id), role: m.role, parts }
  })
}

/** Turn a live SSE message into a UI message. */
function liveToUiMessage(msg: LiveMessage): MasterLuUIMessage {
  const parts: MasterLuUIMessage['parts'] = [{ type: 'text', text: msg.content }]
  if (msg.role === 'assistant' && (msg.suggested_categories?.length || msg.is_admin_reply)) {
    parts.push({
      type: 'data-sources',
      id: 'sources',
      data: {
        books: [],
        grounded: true,
        suggestedCategories: msg.suggested_categories ?? [],
        isAdminReply: msg.is_admin_reply ?? false,
      },
    })
  }
  return { id: String(msg.id), role: msg.role, parts }
}

/** Append a live message unless it's already shown (dedupe by server id). */
function appendLiveMessage(msg: LiveMessage) {
  // Track the id for backfill even for messages we don't render here — the
  // skipped ones are already on screen via the local chat stream.
  if (msg.id > lastLiveId) lastLiveId = msg.id
  // In AI mode the user's message and the AI reply are already rendered by the
  // local chat stream, so the SSE echoes of those would duplicate. Only an
  // admin's "reply once" answer is produced outside that flow — accept just it.
  // In human (takeover) mode there is no local stream, so accept everything.
  if (!humanMode.value && !msg.is_admin_reply) return
  const id = String(msg.id)
  if (chat.messages.some((m) => m.id === id)) return
  chat.messages = [...chat.messages, liveToUiMessage(msg)]
  autoScroll()
}

/** Highest numeric message id in the loaded history (0 when empty). */
function historyMaxId(records: { id: number }[]): number {
  return records.reduce((max, m) => (m.id > max ? m.id : max), 0)
}

/** React to an admin taking over or releasing the conversation live. */
async function onModeChange(human: boolean, convId: number) {
  if (human === humanMode.value) return
  humanMode.value = human
  if (isBusy.value) chat.stop()
  // Resync so the switch shows the correct, complete history either way.
  try {
    const data = await chatApi.getConversation(convId)
    chat.messages = toUiMessages(data.messages)
    lastLiveId = Math.max(lastLiveId, historyMaxId(data.messages))
    scrollToBottom()
  } catch {
    /* the stream will keep delivering new messages */
  }
}

function stopLiveStream() {
  liveSub?.close()
  liveSub = null
}

/**
 * Keep an SSE channel open for the current conversation. It carries admin
 * takeover/release (`mode_change`) even while the AI is still answering, so the
 * UI flips to/from live mode the moment an admin acts — no message needed.
 */
function startLiveStream(convId: number) {
  stopLiveStream()
  liveSub = subscribeConversationStream({
    url: `${config.public.apiV2BaseUrl}/chat/conversations/${convId}/stream`,
    getAuthHeader: () => getAuthHeader() as Record<string, string>,
    onMessage: appendLiveMessage,
    onModeChange: (c) => onModeChange(c.human_mode, convId),
    getAfterId: () => lastLiveId,
    // Backfill covers missed messages; resync catches a missed mode_change.
    onResync: async () => {
      try {
        const data = await chatApi.getConversation(convId)
        humanMode.value = data.conversation.human_mode ?? false
      } catch {
        /* keep the current view; reconnect will retry */
      }
    },
  })
}

/** Transport saw a human_mode response — flip to live mode (stream already open). */
function enterHumanMode(convId: number) {
  onModeChange(true, convId)
}

async function selectConversation(id: number) {
  if (isBusy.value) chat.stop()
  drawerOpen.value = false
  try {
    const data = await chatApi.getConversation(id)
    chat.messages = toUiMessages(data.messages)
    selectedCategory.value = data.conversation.category
    humanMode.value = data.conversation.human_mode ?? false
    // Seed the backfill cursor before the stream opens (via the conversationId watch).
    lastLiveId = historyMaxId(data.messages)
    conversationId.value = id
    scrollToBottom()
  } catch {
    toast.add({ title: 'Gagal memuat percakapan', color: 'error' })
  }
}

async function confirmDelete(c: ConversationListItem) {
  if (!window.confirm(`Hapus percakapan "${c.title || 'Tanpa judul'}"?`)) return
  try {
    await chatApi.deleteConversation(c.id)
    conversations.value = conversations.value.filter((x) => x.id !== c.id)
    conversationsTotal.value = Math.max(conversationsTotal.value - 1, conversations.value.length)
    if (conversationId.value === c.id) newChat()
  } catch {
    toast.add({ title: 'Gagal menghapus percakapan', color: 'error' })
  }
}

function startNewChat() {
  newChat()
  drawerOpen.value = false
}

const showScrollBtn = ref(false)
// Whether the viewport is currently near the bottom (within 80px).
let nearBottom = true

function updateScrollState() {
  const el = scrollEl.value
  if (!el) return
  nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  showScrollBtn.value = !nearBottom && el.scrollHeight > el.clientHeight + 80
}

function onScroll() {
  updateScrollState()
}

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  nextTick(() => {
    const el = scrollEl.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior })
    nearBottom = true
    showScrollBtn.value = false
  })
}

// Auto-scroll on new content only when the user is already at the bottom, so we
// don't yank the view while they're reading earlier messages.
function autoScroll() {
  if (nearBottom) scrollToBottom()
  else updateScrollState()
}

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 128)}px`
}

async function fetchBalance() {
  if (!isAuthenticated.value) return
  try {
    balance.value = await depositApi.getBalance()
  } catch {
    /* non-fatal: the badge just stays hidden */
  }
}

/** Reflect a server-side "nothing left to spend" verdict in the cached balance. */
function applyDepletedBalance(extra?: BillingError) {
  if (!balance.value) {
    fetchBalance()
    return
  }
  const mrp = extra?.balanceMrp ?? 0
  balance.value = {
    ...balance.value,
    balance_mrp: mrp,
    balance_rp: extra?.balanceRp ?? Math.floor(mrp / 1000),
    free: {
      ...balance.value.free,
      remaining: 0,
      used: balance.value.free.limit,
      reset_at: extra?.resetAt ?? balance.value.free.reset_at,
    },
  }
}

function goToSaldo() {
  router.push('/saldo')
}

async function ensureCategories(force = false) {
  if (!isAuthenticated.value) return
  if (categories.value.length && !force) return
  loadingCategories.value = true
  try {
    categories.value = await chatApi.listCategories()
  } catch {
    /* keep whatever we have */
  } finally {
    loadingCategories.value = false
  }
}

/**
 * Send a message, gating new conversations behind category selection.
 * A new conversation (no conversation_id) requires a category first, so we hold
 * the message and show the picker; once a category is chosen the message is sent.
 */
function submitMessage(text: string) {
  const trimmed = text.trim()
  if (!trimmed || isBusy.value || !isAuthenticated.value) return

  if (outOfCredit.value) {
    toast.add({
      title: 'Saldo habis',
      description: 'Jatah gratis hari ini sudah terpakai. Isi Saldo Deposit untuk melanjutkan.',
      color: 'warning',
      actions: [{ label: 'Isi Saldo', onClick: goToSaldo }],
    })
    return
  }

  if (!conversationId.value && !selectedCategory.value) {
    pendingMessage.value = trimmed
    input.value = ''
    nextTick(autoGrow)
    ensureCategories()
    showCategoryPicker.value = true
    return
  }

  errorHint.value = null
  chat.sendMessage({ text: trimmed })
}

function pickCategory(cat: ChatCategory) {
  selectedCategory.value = cat
  showCategoryPicker.value = false
  const text = pendingMessage.value
  pendingMessage.value = ''
  if (text) chat.sendMessage({ text })
}

function cancelCategoryPicker() {
  showCategoryPicker.value = false
  // Return the held message to the input so it isn't lost.
  if (pendingMessage.value && !input.value) {
    input.value = pendingMessage.value
    nextTick(autoGrow)
  }
  pendingMessage.value = ''
}

function send() {
  const text = input.value.trim()
  if (!text || isBusy.value || !isAuthenticated.value) return
  input.value = ''
  nextTick(autoGrow)
  if (humanMode.value && conversationId.value) {
    sendHumanMessage(text)
  } else {
    submitMessage(text)
  }
}

/**
 * Send in live (admin takeover) mode: a plain POST — no AI reply comes back.
 * Both the user's message and the admin's replies arrive over the SSE channel.
 * If the admin has meanwhile released the conversation, the response carries a
 * normal AI reply, so we fall back to resyncing and leaving live mode.
 */
async function sendHumanMessage(text: string) {
  const convId = conversationId.value
  if (!convId) return
  try {
    const res = await $fetch<{ data?: { human_mode?: boolean } }>(
      `${config.public.apiV2BaseUrl}/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthHeader() as Record<string, string>),
        },
        body: { conversation_id: convId, message: text, stream: false },
      },
    )
    if (res?.data?.human_mode === false) {
      // Released back to the AI — leave live mode and pull the fresh answer.
      humanMode.value = false
      stopLiveStream()
      const data = await chatApi.getConversation(convId)
      chat.messages = toUiMessages(data.messages)
      scrollToBottom()
    }
    // Otherwise the SSE channel echoes the user message and the admin's reply.
  } catch {
    toast.add({ title: 'Gagal mengirim pesan', color: 'error' })
    input.value = text
    nextTick(autoGrow)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function retry() {
  errorHint.value = null
  chat.clearError()
  chat.regenerate()
}

function newChat() {
  chat.stop()
  stopLiveStream()
  humanMode.value = false
  lastLiveId = 0
  chat.messages = []
  conversationId.value = undefined
  selectedCategory.value = null
  pendingMessage.value = ''
  showCategoryPicker.value = false
  errorHint.value = null
}

function goBack() {
  router.back()
}

onBeforeUnmount(stopLiveStream)

watch(
  () => [messages.value.length, messages.value[messages.value.length - 1]?.parts, isWaiting.value],
  autoScroll,
  { deep: true },
)

// Keep the SSE channel bound to the current conversation so admin
// takeover/release is heard live, even while the AI is still answering.
watch(conversationId, (id) => {
  stopLiveStream()
  if (id) startLiveStream(id)
})

onMounted(() => {
  if (isAuthenticated.value) {
    refreshConversations()
    ensureCategories()
    fetchBalance()
  }
})

useHead({ title: 'Chatbot' })
</script>

<style scoped>
/* Typing indicator */
.typing-dot {
  animation: typing-bounce 1.2s infinite ease-in-out;
}
@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* Drawer transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

/* Markdown rendering for assistant replies */
.md-content :deep(p) {
  margin: 0 0 0.5rem;
}
.md-content :deep(p:last-child) {
  margin-bottom: 0;
}
.md-content :deep(h1),
.md-content :deep(h2),
.md-content :deep(h3),
.md-content :deep(h4) {
  font-weight: 600;
  margin: 0.75rem 0 0.35rem;
  line-height: 1.3;
}
.md-content :deep(h1) { font-size: 1.25em; }
.md-content :deep(h2) { font-size: 1.15em; }
.md-content :deep(h3),
.md-content :deep(h4) { font-size: 1.05em; }
.md-content :deep(ul),
.md-content :deep(ol) {
  margin: 0.25rem 0 0.5rem;
  padding-left: 1.25rem;
}
.md-content :deep(ul) { list-style: disc; }
.md-content :deep(ol) { list-style: decimal; }
.md-content :deep(li) { margin: 0.15rem 0; }
.md-content :deep(li::marker) { color: var(--color-primary, #c09637); }
.md-content :deep(a) {
  color: var(--color-primary, #c09637);
  text-decoration: underline;
  word-break: break-word;
}
.md-content :deep(strong) { font-weight: 600; }
.md-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary, #c09637);
  padding: 0.25rem 0.75rem;
  margin: 0.5rem 0;
  background: rgba(192, 150, 55, 0.08);
  border-radius: 0.375rem;
}
.md-content :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.85em;
}
.md-content :deep(pre) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}
.md-content :deep(pre code) {
  background: transparent;
  padding: 0;
}
.dark .md-content :deep(code),
.dark .md-content :deep(pre) {
  background: rgba(255, 255, 255, 0.08);
}
</style>
