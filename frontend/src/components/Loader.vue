<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[9999] bg-white dark:bg-slate-900 flex flex-col items-center justify-center transition-colors duration-500">
      <div class="relative">
        <!-- Pulse Rings -->
        <div class="absolute inset-0 bg-indigo-500/20 rounded-3xl animate-ping scale-150"></div>
        <div class="absolute inset-0 bg-indigo-500/10 rounded-3xl animate-ping scale-200 delay-300"></div>
        
        <!-- Animated Logo -->
        <div class="relative w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-indigo-600/40 animate-loader-bounce">
          F.
        </div>
      </div>
      
      <!-- Loading Text -->
      <div class="mt-10 flex flex-col items-center">
        <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-widest uppercase">Fncly.</h2>
        <div class="flex space-x-2 mt-4">
          <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
          <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes loader-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.animate-loader-bounce {
  animation: loader-bounce 1.5s infinite ease-in-out;
}
</style>
