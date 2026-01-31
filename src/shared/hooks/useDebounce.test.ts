import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 50))
    expect(result.current).toBe('initial')
  })

  it('should debounce value updates with default delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated' })

    // Value should still be the old one
    expect(result.current).toBe('initial')

    // Wait for debounce to complete
    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: 200 })
  })

  it('should debounce value updates with custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: 300 })
  })

  it('should handle rapid value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      { initialProps: { value: 'initial' } }
    )

    // Rapidly change values
    rerender({ value: 'change1' })
    await new Promise(resolve => setTimeout(resolve, 10))

    rerender({ value: 'change2' })
    await new Promise(resolve => setTimeout(resolve, 10))

    rerender({ value: 'change3' })

    // Still should be initial value
    expect(result.current).toBe('initial')

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe('change3')
    }, { timeout: 200 })
  })

  it('should cleanup timer on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('test', 50))

    // Unmount should not cause any errors
    unmount()
  })

  it('should handle different data types', async () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      { initialProps: { value: 0 } }
    )

    numberRerender({ value: 42 })

    await waitFor(() => {
      expect(numberResult.current).toBe(42)
    }, { timeout: 200 })

    // Test with object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      { initialProps: { value: { count: 0 } } }
    )

    const newObj = { count: 1 }
    objectRerender({ value: newObj })

    await waitFor(() => {
      expect(objectResult.current).toEqual(newObj)
    }, { timeout: 200 })
  })

  it('should reset timer when value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 80),
      { initialProps: { value: 'initial' } }
    )

    // First update
    rerender({ value: 'first' })
    await new Promise(resolve => setTimeout(resolve, 60))

    // Second update before first delay completes
    rerender({ value: 'second' })
    await new Promise(resolve => setTimeout(resolve, 30))

    // Should still be initial because timer was reset
    expect(result.current).toBe('initial')

    // Wait for the new debounce to complete
    await waitFor(() => {
      expect(result.current).toBe('second')
    }, { timeout: 200 })
  })

  it('should handle delay changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 50 } }
    )

    // Update with new value and delay
    rerender({ value: 'updated', delay: 100 })

    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: 300 })
  })
})
