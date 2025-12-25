#!/bin/bash

# Remove Vue Formulate plugin (no longer needed in Nuxt 4)
rm -f plugins/vueFormulate.js

# Remove v-tooltip plugin (replaced by floating-vue which auto-installs)
rm -f plugins/vueTooltip.client.js

# Remove vue-paginate plugin (will use custom pagination or headless-ui)
rm -f plugins/vuePaginate.client.js

# Remove vue-star-rating plugin (use alternative if needed)
rm -f plugins/vueStarRating.client.js

echo "✅ Obsolete plugins removed"
echo "✅ Remember to:"
echo "   1. Remove vue-formulate components references"
echo "   2. Convert forms to use new FormField component"
echo "   3. Replace v-tooltip directives with floating-vue"
echo "   4. Replace paginate component with custom pagination"
