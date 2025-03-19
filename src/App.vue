<template>
  <div class="vite-container">
    <!-- 背景效果 -->
    <div class="vite-bg">
      <div class="vite-grid"></div>
      <div class="vite-gradient"></div>
    </div>
    
    <!-- 顶部导航 -->
    <header class="vite-header">
      <div></div>
      <div class="header-right">
        <div class="language-switch">
          <el-button 
            @click="switchLanguage" 
            size="small" 
            class="lang-btn"
          >
            {{ currentLang === 'zh-CN' ? 'English' : '中文' }}
          </el-button>
        </div>
        <a href="https://github.com/ishangsf/download-vsix" target="_blank" class="github-link" title="GitHub仓库">
          <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="github-icon">
            <path fill="currentColor" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
        </a>
      </div>
    </header>
    
    <!-- 主要内容 -->
    <main class="vite-content">
      <div class="vite-hero">
        <h1 class="vite-title">{{ $t('appTitle') }}<span class="vite-accent">.</span></h1>
        <p class="vite-subtitle">{{ $t('appSubtitle') }}</p>
        
        <div class="vite-file-icons">
          <span class="file-icon html">.html</span>
          <span class="file-icon css">.css</span>
          <span class="file-icon js">.js</span>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            :placeholder="$t('searchPlaceholder')"
            class="search-input"
            @keyup.enter="searchExtension"
          >
            <template #append>
              <el-button @click="searchExtension" :loading="loading" class="search-btn">
                <el-icon><Search /></el-icon>
                {{ $t('searchButton') }}
              </el-button>
            </template>
          </el-input>
        </div>
        
        <!-- 错误信息 -->
        <div v-if="error" class="error-message">
          <el-alert
            :title="error"
            type="error"
            show-icon
            :closable="false"
          />
        </div>
      </div>
      
      <!-- 特性介绍 -->
      <div class="features-section" v-if="!extension">
        <h2 class="section-title">{{ $t('featuresTitle') }}</h2>
        <h3 class="section-subtitle">{{ $t('featuresSubtitle') }}</h3>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="feature-emoji">🔍</i>
            </div>
            <h3 class="feature-title">{{ $t('feature1Title') }}</h3>
            <p class="feature-description">{{ $t('feature1Description') }}</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="feature-emoji">📦</i>
            </div>
            <h3 class="feature-title">{{ $t('feature2Title') }}</h3>
            <p class="feature-description">{{ $t('feature2Description') }}</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="feature-emoji">⚡</i>
            </div>
            <h3 class="feature-title">{{ $t('feature3Title') }}</h3>
            <p class="feature-description">{{ $t('feature3Description') }}</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="feature-emoji">🔄</i>
            </div>
            <h3 class="feature-title">{{ $t('feature4Title') }}</h3>
            <p class="feature-description">{{ $t('feature4Description') }}</p>
          </div>
        </div>
      </div>
      
      <!-- 扩展详情 -->
      <div v-if="extension" class="extension-details">
        <el-card class="vite-card">
          <div class="back-icon-container">
            <el-tooltip :content="$t('backButton')" placement="top">
              <el-button @click="resetSearch" class="back-icon-button" type="text">
                <el-icon><Back /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <div class="extension-header">
            <div v-if="extension.icon" class="extension-icon">
              <img :src="extension.icon" :alt="extension.displayName">
            </div>
            <div class="extension-title">
              <h2>{{ extension.displayName }}</h2>
              <p>{{ extension.publisher.displayName }} | {{ extension.extensionName }}</p>
            </div>
          </div>
          
          <div class="extension-info">
            <p class="description"><strong>{{ $t('description') }}:</strong> {{ extension.shortDescription }}</p>
            <p><strong>{{ $t('version') }}:</strong> {{ extension.versions[0].version }}</p>
            <p><strong>{{ $t('lastUpdated') }}:</strong> {{ formatDate(extension.versions[0].lastUpdated) }}</p>
            
            <div v-if="extension.tags && extension.tags.length > 0" class="tags-section">
              <strong>{{ $t('tags') }}:</strong>
              <div class="tags-container">
                <el-tag 
                  v-for="(tag, index) in extension.tags.slice(0, 5)" 
                  :key="tag" 
                  size="small" 
                  class="tag-item"
                  :type="getTagType(index)">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            
            <div v-if="extension.categories && extension.categories.length > 0" class="categories-section">
              <strong>{{ $t('categories') }}:</strong>
              <div class="categories-container">
                <el-tag 
                  v-for="(category, index) in extension.categories.slice(0, 5)" 
                  :key="category" 
                  size="small" 
                  class="category-item"
                  :effect="'plain'"
                  :type="getCategoryType(index)">
                  {{ category }}
                </el-tag>
              </div>
            </div>
          </div>

          <div class="version-selector">
            <el-select v-model="selectedVersion" :placeholder="$t('selectVersion')">
              <el-option
                v-for="version in extension.versions"
                :key="version.version"
                :label="version.version + ' (' + formatDate(version.lastUpdated) + ')'"
                :value="version.version"
              />
            </el-select>
          </div>

          <div class="download-button">
            <el-button type="primary" @click="downloadExtension" :loading="downloading" class="vite-button">
              <el-icon><Download /></el-icon>
              {{ $t('downloadButton') }}
            </el-button>
          </div>
        </el-card>
      </div>
      
      <!-- 更多内容区域 -->
      <div class="open-source-section" v-if="!extension">
        <h2 class="section-title">{{ $t('openSourceTitle') }}</h2>
        <p class="open-source-text">{{ $t('openSourceDescription') }}</p>
        
        <div class="github-button">
          <a href="https://github.com/ishangsf/download-vsix" target="_blank" class="vite-outline-button">
            {{ $t('viewOnGithub') }} <span class="arrow">→</span>
          </a>
        </div>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="vite-footer">
      <div class="footer-content">
        <div class="footer-left">
          <p>{{ $t('footerText') }}</p>
        </div>
        <div class="footer-right">
          <p class="copyright">&nbsp;Copyright © {{ new Date().getFullYear() }}</p>
        </div>
      </div>
    </footer>
    
    <!-- 底部装饰 -->
    <div class="vite-features">
      <div class="feature-circle feature-circle-1"></div>
      <div class="feature-circle feature-circle-2"></div>
      <div class="feature-circle feature-circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { Search, Download, Back } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import i18n, { currentLang } from './i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n();
const searchQuery = ref('')
const extension = ref(null)
const loading = ref(false)
const error = ref('')
const downloading = ref(false)
const selectedVersion = ref('')

// 监听扩展变化，自动选择最新版本
watch(extension, (newVal) => {
  if (newVal && newVal.versions && newVal.versions.length > 0) {
    selectedVersion.value = newVal.versions[0].version
  }
}, { immediate: true })

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// 获取标签类型
function getTagType(index) {
  const types = ['', 'success', 'warning', 'danger', 'info'];
  return types[index % types.length];
}

// 获取分类类型
function getCategoryType(index) {
  const types = ['', 'success', 'warning', 'danger', 'info'];
  return types[index % types.length];
}

// 切换语言
function switchLanguage() {
  currentLang.value = currentLang.value === 'zh-CN' ? 'en-US' : 'zh-CN';
  // 更新HTML的lang属性
  document.documentElement.lang = currentLang.value;
  // i18n实例的locale属性会通过i18n.js中的watch自动更新
  // 这里不需要手动设置i18n.global.locale.value，因为已经在i18n.js中通过watch实现了
}

// 搜索扩展
async function searchExtension() {
  if (!searchQuery.value.trim()) {
    error.value = t('searchPlaceholder')
    return
  }

  loading.value = true
  error.value = ''
  extension.value = null

  try {
    // 构建API URL
    const query = searchQuery.value.trim()
    const apiUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery`
    
    // 准备请求体 - 根据VS Code Marketplace API示例简化请求参数
    const requestBody = {
      filters: [
        {
          criteria: [
            { filterType: 10, value: query } // 按标签搜索
          ]
        }
      ],
      flags: 103 // 使用示例中提供的flags值
    }

    // 发送请求 - 使用示例中提供的简化请求头
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json;api-version=3.0-preview.1'
      },
      timeout: 10000 // 设置10秒超时
    })

    // 检查响应数据结构
    if (response.data && response.data.results) {
      if (response.data.results.length > 0) {
        if (response.data.results[0].extensions && 
            response.data.results[0].extensions.length > 0) {
          
          extension.value = response.data.results[0].extensions[0]
          ElMessage({
            message: t('searchSuccess', { name: extension.value.displayName }),
            type: 'success'
          })
        } else {
          error.value = t('errorNotFound')
          ElMessage({
            message: t('errorNotFound'),
            type: 'warning'
          })
        }
      } else {
        error.value = t('errorNotFound')
        ElMessage({
          message: t('errorNotFound'),
          type: 'warning'
        })
      }
    } else {
      error.value = t('errorNotFound')
      ElMessage({
        message: t('errorNotFound'),
        type: 'warning'
      })
    }
  } catch (err) {
    // 提供更详细的错误信息
    if (err.response) {
      // 服务器返回了错误状态码
      error.value = `${t('errorGeneric')} ${err.response.status} - ${err.message}`
      ElMessage({
        message: `${t('errorGeneric')} ${err.response.status} - ${err.message}`,
        type: 'error'
      })
    } else if (err.request) {
      // 请求已发送但没有收到响应
      error.value = t('errorNetwork')
      ElMessage({
        message: t('errorNetwork'),
        type: 'error'
      })
    } else {
      // 请求设置时出错
      error.value = t('errorGeneric') + (err.message || t('unknown'))
      ElMessage({
        message: t('errorGeneric') + (err.message || t('unknown')),
        type: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}

// 下载扩展
async function downloadExtension() {
  if (!extension.value || !selectedVersion.value) return
  
  downloading.value = true
  
  try {
    // 构建下载URL
    const publisher = extension.value.publisher.publisherName
    const extensionName = extension.value.extensionName
    const version = selectedVersion.value
    
    // 使用Visual Studio Marketplace的下载链接格式
    const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`
    
    // 创建一个隐藏的a标签来触发下载
    const link = document.createElement('a')
    
    // 使用axios下载，添加必要的请求头
    const response = await axios.get(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/octet-stream',
        'X-Market-Client-Id': 'VSCode',
        'X-Market-User-Id': 'VSCode'
      },
      responseType: 'blob'
    })
    
    // 创建Blob URL并触发下载
    const blob = new Blob([response.data])
    link.href = URL.createObjectURL(blob)
    link.download = `${publisher}.${extensionName}-${version}.vsix`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    
    // 显示下载成功消息
    ElMessage({
      message: t('downloadSuccess', { name: extension.value.displayName }),
      type: 'success'
    })
  } catch (err) {
    error.value = t('errorDownload') + (err.message || t('unknown'))
    ElMessage({
      message: t('errorDownload') + (err.message || t('unknown')),
      type: 'error'
    })
  } finally {
    downloading.value = false
  }
}

// 重置搜索
function resetSearch() {
  searchQuery.value = ''
  extension.value = null
}
</script>

<style scoped>
.features-section {
  text-align: center;
}
.vite-container {
  min-height: 100vh;
  width: 100%;
  background: #13141f;
  color: #fff;
  position: relative;
  overflow: hidden;
}

/* 背景效果 */
.vite-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.vite-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
}

.vite-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
}

/* 顶部导航 */
.vite-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
  background: rgba(19, 20, 31, 0.8);
  backdrop-filter: blur(10px);
}

.github-link {
  color: #fff;
  transition: opacity 0.2s;
}

.github-link:hover {
  opacity: 0.8;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-switch {
  display: flex;
  align-items: center;
}

.lang-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.2s;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 主要内容 */
.vite-content {
  position: relative;
  z-index: 1;
  padding: 120px 2rem 100px; /* 修改padding-bottom为100px，为footer留出空间 */
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 64px - 64px); /* 设置最小高度为视口高度减去header和footer的高度 */
  box-sizing: border-box; /* 确保padding计入总高度 */
}

.vite-hero {
  text-align: center;
  margin-bottom: 4rem;
}

.vite-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #646cff, #535bf2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.vite-accent {
  color: #646cff;
}

.vite-subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.vite-file-icons {
  margin-bottom: 2rem;
}

.file-icon {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  margin: 0 0.5rem;
}

/* 搜索框 */
.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  --el-input-bg-color: rgba(255, 255, 255, 0.1);
  --el-input-border-color: rgba(255, 255, 255, 0.2);
  --el-input-hover-border-color: #646cff;
  --el-input-focus-border-color: #646cff;
  --el-input-text-color: #fff;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: none;
}

.search-btn {
  background: #646cff;
  border: none;
  color: #fff;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #535bf2;
}

/* 错误信息 */
.error-message {
  max-width: 600px;
  margin: 1rem auto;
}

/* 扩展详情 */
.extension-details {
  max-width: 800px;
  margin: 0 auto;
}

.vite-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  position: relative;
}

.back-icon-container {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.back-icon-button {
  color: #fff;
  font-size: 1.2rem;
  padding: 0.3rem;
  border: none;
  background: transparent;
  transition: all 0.2s;
}

.back-icon-button:hover {
  color: #646cff;
  transform: scale(1.1);
}

.extension-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.extension-icon {
  width: 64px;
  height: 64px;
  margin-right: 1rem;
}

.extension-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.extension-title h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #fff;
}

.extension-title p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.extension-info {
  margin-bottom: 2rem;
}

.extension-info p {
  margin: 0.5rem 0;
  color: rgba(255, 255, 255, 0.8);
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
}

.tags-section,
.categories-section {
  margin-top: 1rem;
}

.tags-container,
.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item,
.category-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.version-selector {
  margin-bottom: 2rem;
}

.version-selector :deep(.el-select) {
  width: 100%;
}

.download-button {
  text-align: center;
}

.vite-button {
  background: #646cff;
  border: none;
  color: #fff;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.vite-button:hover {
  background: #535bf2;
  transform: translateY(-1px);
}

/* 更多内容区域 */
.open-source-section {
  text-align: center;
  margin-top: 4rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}

.open-source-text {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.github-button {
  margin-top: 1rem;
}

.vite-outline-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.vite-outline-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 页脚 */
.vite-footer {
  font-size: 12px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  z-index: 100;
  background: rgba(19, 20, 31, 0.8);
  backdrop-filter: blur(10px);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: .6;
}

.footer-left {
  display: flex;
  align-items: center;
  color: #ccc
}

.footer-right {
  display: flex;
  align-items: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.7);
}

/* 底部装饰 */
.vite-features {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  z-index: 0;
}

.feature-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
}

.feature-circle-1 {
  width: 300px;
  height: 300px;
  background: #646cff;
  bottom: -100px;
  left: -100px;
}

.feature-circle-2 {
  width: 200px;
  height: 200px;
  background: #535bf2;
  bottom: -50px;
  right: -50px;
}

.feature-circle-3 {
  width: 150px;
  height: 150px;
  background: #646cff;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}
</style>