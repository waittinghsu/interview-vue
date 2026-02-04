<script setup>
const userStore = useUserStore()

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">
      <i class="i-carbon-home mr-2" />
      Interview Vue
    </h1>

    <q-card class="max-w-md bg-[#012f17]">
      <q-card-section>
        <div class="text-h6">
          歡迎使用面試練習專案
        </div>
        <div class="text-subtitle2 text-grey">
          Vue 3 + Vite + Pinia + Quasar
        </div>
      </q-card-section>

      <q-card-section>
        <div class="flex items-center gap-4">
          <q-btn color="primary" @click="increment">
            Count: {{ count }}
          </q-btn>
          <q-btn flat to="/about">
            關於頁面
          </q-btn>
          <q-btn flat to="/Seat-Grid">
            SeatGrid頁面
          </q-btn>
          <q-btn flat to="/Seat-Rotate">
            SeatRotate頁面
          </q-btn>
        </div>
      </q-card-section>

      <q-card-section v-if="userStore.isLoggedIn">
        <div class="text-body1">
          歡迎回來，{{ userStore.user?.name }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
