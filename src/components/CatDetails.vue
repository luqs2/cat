<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCatsByBreed } from '../services/catApi'
import type { Cat } from '../types/cat'

const route = useRoute()
const cat = ref<Cat | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)


const loadCatDetails = async () => {
  const catName = route.params.name as string
  if (!catName) return

  loading.value = true
  try {
    const cats = await fetchCatsByBreed(decodeURIComponent(catName))
    cat.value = cats[0] || null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load cat details'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCatDetails()
})
</script>

<template>
  <div class="cat-details-container">
    <div v-if="loading" class="loading">Loading cat details...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="cat" class="cat-details">


      <div class="title">
        <h1>{{ cat.name }}</h1>
      </div>
      <div class="image">
        <img :src="cat.image_link" :alt="cat.name" />
      </div>
      <div class="info">
        <div class="info-section">
          <h2>Physical Characteristics</h2>
          <div class="info-grid">
            <div class="info-item">
              <h3>Length</h3>
              <p>{{ cat.length }}</p>
            </div>
            <div class="info-item">
              <h3>Weight Range</h3>
              <p>{{ cat.min_weight }} - {{ cat.max_weight }} kg</p>
            </div>
            <div class="info-item">
              <h3>Life Expectancy</h3>
              <p>{{ cat.min_life_expectancy }} - {{ cat.max_life_expectancy }} years</p>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2>😸 Characteristics</h2>
          <div class="ratings-grid">
            <div class="rating-item">
              <span>Family Friendly</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: `${cat.family_friendly * 20}%` }" />
              </div>
            </div>
            <div class="rating-item">
              <span>Playfulness</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: `${cat.playfulness * 20}%` }" />
              </div>
            </div>
            <div class="rating-item">
              <span>General Health</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: `${cat.general_health * 20}%` }" />
              </div>
            </div>
            <div class="rating-item">
              <span>Intelligence</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: `${cat.intelligence * 20}%` }" />
              </div>
            </div>
            <div class="rating-item">
              <span>Shedding</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: `${cat.shedding * 20}%` }" />
              </div>
            </div>
            <div class="rating-item">
              <span>Other Pets Friendly</span>
              <div class="rating-bar">
                <div class="rating-fill" :style="{ width: `${cat.other_pets_friendly * 20}%` }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="not-found">Cat not found</div>
  </div>
</template>

<style scoped>
.cat-details-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.title h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.image {
  text-align: center;
  margin-bottom: 2rem;
}

.image img {
  width: 100%;
  max-width: 400px;
  max-height: 400px;
  height: auto;
  border-radius: 5%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.251);
  object-fit: cover;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item h3 {
  color: #666;
  margin-bottom: 0.5rem;
}

.ratings-grid {
  display: grid;
  gap: 1rem;
}

.rating-item span {
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 0.5rem;
  color: #666;
}

.rating-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: #42b883;
  transition: width 0.3s ease;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .cat-details-container {
    padding: 1rem;
  }
}
</style>
