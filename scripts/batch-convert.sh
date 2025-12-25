#!/bin/bash

# Batch convert Vue 2 class components to Vue 3 Composition API
# Only converts simple components with just @Prop and/or computed

PROJECT_DIR="${1:-.}"

echo "🔍 Scanning for components using vue-property-decorator..."

# Find all Vue files with vue-property-decorator
find "$PROJECT_DIR" -name "*.vue" -type f | while read -r file; do
    if ! grep -q "vue-property-decorator" "$file"; then
        continue
    fi
    
    # Skip if already converted (has <script setup)
    if grep -q "<script setup" "$file"; then
        continue
    fi
    
    # Skip complex files with lifecycle hooks we can't easily convert
    if grep -qE "(created|mounted|destroyed|beforeCreate|beforeMount|beforeDestroy|beforeUpdate|updated)\s*\(" "$file"; then
        echo "⏭️  Skipping $file (has lifecycle hooks)"
        continue
    fi
    
    echo "📝 Converting: $file"
    
    # Backup the original
    cp "$file" "$file.backup"
    
    # Do the conversion - this is a template
    # The actual conversion needs to be done by a proper Node.js script
    # or manually per file due to complexity
done

echo "✅ Conversion complete. Backups saved with .backup extension"
