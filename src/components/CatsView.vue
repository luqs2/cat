<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCatsListByBreed } from '../services/catApi'
import type { Cat } from '../types/cat'

const router = useRouter()
const cats = ref<Cat[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 20

const viewCatDetails = (catName: string) => {
  router.push(`/cats/${encodeURIComponent(catName)}`)
}

const loadAllCats = async (page: number = 1) => {
  loading.value = true
  try {
    const offset = (page - 1) * itemsPerPage
    cats.value = await fetchCatsListByBreed(offset)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load cats'
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  currentPage.value++
  loadAllCats(currentPage.value)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadAllCats(currentPage.value)
  }
}

onMounted(() => {
  loadAllCats()
})
</script>

<template>
  <div class="cats-container">
    <h1>Cat Breeds Collection</h1>
    <p class="subtitle">Explore our comprehensive cat breeds gallery</p>

    <div v-if="loading" class="loading">Loading cats...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div class="cats-grid">
        <div v-for="cat in cats" :key="cat.name" class="cat-card">
          <img :src="cat.image_link" :alt="cat.name" class="cat-image" />
          <div class="cat-info">
            <h3>{{ cat.name }}</h3>
            <p class="origin">{{ cat.origin }}</p>
            <div class="stats">
              <div class="stat-row">
                <span>Minimum Weight: {{ cat.min_weight }}Kg - {{ cat.max_weight }}Kg </span>
              </div>

              <div class="stat-row">
                <span>General Health:</span>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: `${cat.general_health * 20}%` }" />
                </div>
                <div class="viewdetails">
                  <button @click="viewCatDetails(cat.name)" class="details">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="previousPage" class="pagination-btn">
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }}</span>
        <button :disabled="cats.length < itemsPerPage" @click="nextPage" class="pagination-btn">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewdetails {
  padding-top: 20px;
  .details {
    background-color: #367b39;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    /* margin: 4px 2px; */
    cursor: pointer;
  }
}
.cats-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.cat-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.cat-card:hover {
  transform: translateY(-5px);
}

.cat-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.cat-info {
  padding: 1.5rem;
}

.cat-info h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.origin {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.stats {
  margin-top: 1rem;
}

.stat-row {
  margin: 0.5rem 0;
  flex: 1;
  flex-direction: row;
}

.stat-row span {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: #42b883;
  transition: width 0.3s ease;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .cats-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .cats-container {
    padding: 1rem;
  }
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  background-color: #367b39;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
}
</style>
