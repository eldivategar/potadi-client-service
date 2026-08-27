<script setup lang="ts">
import { computed } from "vue";

const { locale, setLocale } = useI18n({ useScope: "global" });

const currentLocale = computed(() => locale.value);

const availableLocales = [
  {
    code: "id",
    name: "Bahasa Indonesia",
    shortLabel: "ID",
    flag: "🇮🇩",
  },
  {
    code: "en",
    name: "English",
    shortLabel: "EN",
    flag: "🇬🇧",
  },
];

const currentFlag = computed(() => {
  const found = availableLocales.find((l) => l.code === currentLocale.value);
  return found ? found.flag : "🇮🇩";
});

const langCookie = useCookie<string>("potadi_i18n_lang", {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
});

const handleSelect = (code: "id" | "en") => {
  langCookie.value = code;
  setLocale(code);
};
</script>

<template>
  <ClientOnly>
    <UDropdownMenu
      :items="[
        availableLocales.map((loc) => ({
          label: `${loc.flag}   ${loc.name}`,
          icon: loc.code === currentLocale ? 'i-ph-check-bold' : undefined,
          onSelect: () => handleSelect(loc.code as 'id' | 'en'),
          class:
            loc.code === currentLocale
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5',
        })),
      ]"
      :ui="{
        content:
          'w-52 p-1.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl shadow-xl z-50 border border-slate-200 dark:border-white/10',
        item: 'rounded-xl text-xs py-2 px-3 font-medium transition-all cursor-pointer flex items-center justify-between',
      }"
    >
      <button
        type="button"
        class="h-8.5 px-3 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer active:scale-95"
        aria-label="Select Language"
      >
        <span class="text-sm leading-none select-none">{{ currentFlag }}</span>
        <span class="font-bold tracking-wider uppercase">{{ currentLocale }}</span>
        <UIcon name="i-ph-caret-down-bold" class="size-3 text-slate-500" />
      </button>
    </UDropdownMenu>

    <template #fallback>
      <div
        class="h-8.5 px-3 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 flex items-center gap-1.5 text-xs text-slate-400"
      >
        <span class="text-sm leading-none">🇮🇩</span>
        <span>ID</span>
      </div>
    </template>
  </ClientOnly>
</template>
