<script setup lang="ts">
const props = defineProps<{
  text?: string
  icon?: string
  leading?: boolean
  size: 'sm' | 'md' | 'lg'
  mode: 'solid' | 'outline' | 'soft'
  disabled?: boolean
}>()

const modeClasses = {
  solid: 'bg-white hover:bg-white/80 text-black',
  outline: 'bg-white/15 border border-white/30 hover:bg-white/40 text-white/50',
  soft: 'bg-white/20 hover:bg-white/30 text-white/30'
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
}

const iconClasses = {
  sm: 'w-4',
  md: 'w-5',
  lg: 'w-7',
}
</script>

<template>
  <button
    :disabled="$props.disabled"
    class="w-fit h-full flex justify-center items-center p-2 rounded-xl duration-200 box-border disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      modeClasses[$props.mode],
      $props.text ? 'gap-2' : 'gap-0',
      $props.leading ? 'flex-row' : 'flex-row-reverse',
    ]"
  >

    <div 
      v-if="$props.icon"
      :class="[iconClasses[props.size]]"
      v-html="props.icon" 
    />
    <p
      class="font-medium font-sans"
      :class="[sizeClasses[props.size]]"
    >
      {{ props.text }}
    </p>

  </button>

</template>