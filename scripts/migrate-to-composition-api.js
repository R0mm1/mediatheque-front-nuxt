#!/usr/bin/env node

/**
 * Migration script: Convert Vue 2 class-based components to Vue 3 Composition API
 * This tool helps migrate from vue-property-decorator to the native Composition API
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const COMPONENT_DIR = path.join(__dirname, '../components')
const PAGES_DIR = path.join(__dirname, '../pages')

function convertComponentFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Skip already converted files (using <script setup>)
    if (content.includes('setup')) {
      console.log(`⏭️  Skipping already converted: ${filePath}`)
      return false
    }

    // Skip non-TypeScript components for now
    if (!content.includes('lang="ts"') && !content.includes("lang='ts'")) {
      console.log(`⏭️  Skipping non-TypeScript: ${filePath}`)
      return false
    }

    console.log(`🔄 Processing: ${filePath}`)

    // Remove vue-property-decorator imports
    content = content.replace(
      /import\s*{[^}]*?\}\s*from\s*['"]vue-property-decorator['"];?\n*/g,
      ''
    )

    // Convert @Component decorators to <script setup>
    content = convertScriptBlock(content)

    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ Converted: ${filePath}`)
    return true
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
    return false
  }
}

function convertScriptBlock(content) {
  const scriptRegex = /<script\s+lang="ts">([\s\S]*?)<\/script>/
  const match = content.match(scriptRegex)

  if (!match) {
    return content
  }

  let scriptContent = match[1]

  // Remove @Component decorator
  scriptContent = scriptContent.replace(/@Component\s*\({[^}]*}\)\s*/gs, '')

  // Remove class declaration and extends Vue
  scriptContent = scriptContent.replace(
    /export\s+default\s+class\s+\w+\s+extends\s+Vue\s*{/,
    ''
  )

  // Remove closing brace of class
  scriptContent = scriptContent.replace(/^}$/m, '')

  // Remove @Prop decorators and convert to props
  const propMatches = scriptContent.matchAll(/@Prop\([^)]*\)\s*(\w+)[!?]:\s*([^\n;=]+)/g)
  const props = []
  for (const propMatch of propMatches) {
    props.push(propMatch[1])
    scriptContent = scriptContent.replace(propMatch[0], '')
  }

  // Create props definition if needed
  if (props.length > 0) {
    const propsDefinition = `const props = defineProps({
  ${props.map(p => `${p}: Object`).join(',\n  ')}
})`
    scriptContent = `import { defineProps } from 'vue'\n${propsDefinition}\n\n${scriptContent}`
  }

  // Add setup script tag
  const newScriptBlock = `<script setup lang="ts">\n${scriptContent}\n</script>`

  return content.replace(scriptRegex, newScriptBlock)
}

function main() {
  console.log('🚀 Starting Vue 2 to Vue 3 component migration...\n')

  const patterns = [
    `${COMPONENT_DIR}/**/*.vue`,
    `${PAGES_DIR}/**/*.vue`
  ]

  let totalFiles = 0
  let convertedFiles = 0

  for (const pattern of patterns) {
    const files = glob.sync(pattern)
    totalFiles += files.length
    
    for (const file of files) {
      if (convertComponentFile(file)) {
        convertedFiles++
      }
    }
  }

  console.log(`\n✨ Migration complete!`)
  console.log(`📊 Statistics:`)
  console.log(`   Total files scanned: ${totalFiles}`)
  console.log(`   Files converted: ${convertedFiles}`)
  console.log(`   Files skipped: ${totalFiles - convertedFiles}`)
}

main()
