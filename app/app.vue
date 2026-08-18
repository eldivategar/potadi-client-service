<script setup lang="ts">
// Nuxt 4 + Nuxt UI v4 + Motion
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <div
      class="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6"
    >
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: 'easeOut' }"
        class="text-center space-y-5 max-w-md"
      >
        <div
          class="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-inner"
        >
          <UIcon name="i-ph-sparkle-fill" class="size-8 text-emerald-400" />
        </div>

        <div class="space-y-1">
          <h1
            class="text-3xl font-bold tracking-tight bg-linear-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent"
          >
            Potadi Client Service
          </h1>
          <p class="text-neutral-400 text-sm">
            Nuxt 4 + Nuxt UI v4 + Tailwind CSS v4 + Motion
          </p>
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <UButton
            label="Get Started"
            color="primary"
            variant="solid"
            icon="i-ph-rocket-launch-duotone"
            to="https://nuxt.com/docs"
            target="_blank"
          />
          <UButton
            label="Documentation"
            color="neutral"
            variant="outline"
            icon="i-ph-book-open-text-duotone"
          />
        </div>
      </Motion>
    </div>
  </UApp>
</template>
