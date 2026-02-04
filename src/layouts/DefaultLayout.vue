<script setup>
// Layout 可以包含共用的頁面結構
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <AppHeader />

    <q-page-container>
      <q-page padding>
        <slot />
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center text-body2">
          Interview Vue - Vue 3 面試練習專案
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
