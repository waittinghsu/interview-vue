<script setup>
const userStore = useUserStore()
const router = useRouter()

async function handleLogout() {
  await userStore.logout()
  router.push('/')
}
</script>

<template>
  <q-header elevated class="bg-primary">
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu">
        <q-menu>
          <q-list style="min-width: 150px">
            <q-item v-close-popup clickable to="/">
              <q-item-section>首頁</q-item-section>
            </q-item>
            <q-item v-close-popup clickable to="/about">
              <q-item-section>關於</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-toolbar-title>
        Interview Vue
      </q-toolbar-title>

      <q-space />

      <template v-if="userStore.isLoggedIn">
        <span class="mr-4">{{ userStore.user?.name }}</span>
        <q-btn flat label="登出" @click="handleLogout" />
      </template>
      <template v-else>
        <q-btn flat label="登入" to="/login" />
      </template>
    </q-toolbar>
  </q-header>
</template>
