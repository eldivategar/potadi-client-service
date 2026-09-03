<script setup lang="ts">
import AppSidebar from "~/components/app/Sidebar.vue";
import AppMobileHeader from "~/components/app/MobileHeader.vue";
import AppBottomNav from "~/components/app/BottomNav.vue";

const { isCollapsed } = useSidebar();
</script>

<template>
  <div
    class="min-h-screen bg-[#EEF3F0] dark:bg-[#111413] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-750 ease-[cubic-bezier(0.25,1,0.5,1)] antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200"
  >
    <!-- Desktop Left Fixed Sidebar (>= 1024px) -->
    <AppSidebar />

    <!-- Mobile Top Header (< 1024px) -->
    <AppMobileHeader />

    <!-- Main Content Area: Offset by lg:pl-72 / lg:pl-[88px] for Fixed Sidebar -->
    <div
      class="flex-1 flex flex-col transition-[padding] duration-750 ease-[cubic-bezier(0.25,1,0.5,1)]"
      :class="isCollapsed ? 'lg:pl-[88px]' : 'lg:pl-72'"
    >
      <slot />
    </div>

    <!-- Mobile Fixed Bottom Navigation Bar (< 1024px) -->
    <AppBottomNav />
  </div>
</template>
