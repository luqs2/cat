<script setup lang="ts" name="CatInfo">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCatsByBreed } from '../services/catApi'
import type { Cat } from '../types/cat'

const router = useRouter() // Initialize router
const cats = ref<Cat[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const navigateToCats = () => {
  router.push('/cats')
}

const handleSearch = async () => {
  if (!searchQuery.value) return

  loading.value = true
  try {
    cats.value = await fetchCatsByBreed(searchQuery.value.toLowerCase())
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load cats'
    cats.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cats.value = []
})
</script>

<template>
  <div class="welcome-container">
    <h1>Cat Breeds Information</h1>
    <p class="intro">Search for cat breeds to learn more about them!</p>

    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Enter cat breed (e.g., persian, siamese)"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch" class="search-btn">Search</button>
    </div>

    <div v-if="loading" class="loading">Searching for cats...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="cats.length > 0" class="cat-grid">
      <div v-for="cat in cats" :key="cat.name" class="cat-card">
        <div class="cat-card-content">
          <h3>{{ cat.name }}</h3>
          <div class="cat-info">
            <p><strong>Origin:</strong> {{ cat.origin }}</p>
            <p><strong>Length:</strong> {{ cat.length }}</p>
            <img :src="cat.image_link" :alt="cat.name" class="cat-image" />
          </div>
          <div class="ratings">
            <div class="rating-item">
              <span>Family Friendly:</span>
              <div class="rating-bars">
                <div class="rating-fill" :style="{ width: `${cat.family_friendly * 20}%` }"></div>
              </div>
            </div>
            <div class="rating-item">
              <span>Shedding:</span>
              <div class="rating-bars">
                <div class="rating-fill" :style="{ width: `${cat.shedding * 20}%` }"></div>
              </div>
            </div>
            <div class="rating-item">
              <span>General Health:</span>
              <div class="rating-bars">
                <div class="rating-fill" :style="{ width: `${cat.general_health * 20}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-results">Enter a cat breed name to see information</div>
  </div>
  <div class="button">
    <button @click="navigateToCats" class="cats-btn">View All Cats</button>
  </div>
</template>

<style scoped>
.cats-btn {
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  .onHover {
    background-color: #3aa876;
  }
}


.search-container {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 30px;
}

input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.search-btn {
  padding: 12px 24px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #3aa876;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 90px;
  margin-top: 30px;
}

.cat-card {
  background-color: #f6f5e356;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.cat-card-content h3 {
  margin: 0 0 15px 0;
  color: #a09e9e;
  font-size: 1.5rem;
}

.cat-info {
  margin-bottom: 20px;
}

.cat-info p {
  margin: 8px 0;
}

.ratings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-item span {
  min-width: 120px;
}

.rating-bars {
  flex: 1;
  height: 10px;
  background-color: #eee6e6;
  border-radius: 5px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background-color: #42b883;
  transition: width 0.3s ease;
}

.no-results {
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 1.1rem;
}

h1,
.intro {
  text-align: center;
  margin-bottom: 20px;
}

.intro {
  color: #a3a2a2;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
}

.cat-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

.button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
}
</style>
