/**
 * useClickOutside Composable
 *
 * Replaces: vue-click-outside directive (Vue 2)
 *
 * Usage in components:
 * ```typescript
 * const elementRef = ref<HTMLElement | null>(null)
 * useClickOutside(elementRef, () => {
 *   console.log('Clicked outside!')
 * })
 * ```
 *
 * Then in template:
 * ```vue
 * <div ref="elementRef">Content</div>
 * ```
 */
export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  callback: (event: MouseEvent) => void
) {
  const handleClick = (event: MouseEvent) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      callback(event)
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick)
  })

  return {
    handleClick
  }
}
