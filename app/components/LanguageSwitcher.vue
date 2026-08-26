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
              ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10'
              : 'text-slate-700 dark:text-slate-300',
        })),
      ]"
      :ui="{
        content:
          'w-52 p-1.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl z-50',
        item: 'rounded-xl text-xs py-2.5 px-3 font-medium transition-colors cursor-pointer flex items-center justify-between',
      }"
    >
      <button
        type="button"
        class="h-9 px-2.5 sm:px-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
        aria-label="Select Language"
      >
        <span class="text-sm leading-none select-none">{{ currentFlag }}</span>
        <span class="font-bold tracking-wider uppercase">{{ currentLocale }}</span>
        <UIcon name="i-ph-caret-down-bold" class="size-3 opacity-60" />
      </button>
    </UDropdownMenu>

    <template #fallback>
      <div
        class="h-9 px-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-1.5 text-xs font-mono text-slate-400"
      >
        <span class="text-sm leading-none">🇮🇩</span>
        <span>ID</span>
      </div>
    </template>
  </ClientOnly>
</template>
