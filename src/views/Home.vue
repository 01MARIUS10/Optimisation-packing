<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center gap-12 p-8">
    <div class="text-center flex flex-col gap-3">
      <h1 class="text-4xl font-bold text-gray-900 tracking-tight">Optimisation Container</h1>
      <p class="text-gray-500 text-lg max-w-md">
        Sélectionnez un module pour commencer à optimiser vos conteneurs.
      </p>
    </div>

    <div class="flex gap-6">
      <RouterLink
        to="/module1d"
        class="group flex flex-col gap-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-52 text-center hover:shadow-md hover:border-blue-300 transition-all"
      >
        <span class="text-5xl">📏</span>
        <span class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Module 1D</span>
        <span class="text-sm text-gray-400">Optimisation linéaire</span>
      </RouterLink>

      <RouterLink
        to="/module2d"
        class="group flex flex-col gap-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-52 text-center hover:shadow-md hover:border-emerald-300 transition-all"
      >
        <span class="text-5xl">🟩</span>
        <span class="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">Module 2D</span>
        <span class="text-sm text-gray-400">Placement rectangulaire</span>
      </RouterLink>
    </div>
  </div>
</template>
