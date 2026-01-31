import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'excluded')
    expect(result).toBe('base conditional')
  })

  it('should handle undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should deduplicate Tailwind classes', () => {
    const result = cn('px-2 py-1', 'px-4')
    // tailwind-merge should keep the last px value
    expect(result).toBe('py-1 px-4')
  })

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle object with boolean values', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true,
    })
    expect(result).toBe('class1 class3')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should merge conflicting Tailwind utilities correctly', () => {
    // Later values should override earlier ones
    const result = cn('bg-red-500', 'bg-blue-500')
    expect(result).toBe('bg-blue-500')
  })

  it('should handle complex Tailwind class combinations', () => {
    const result = cn(
      'text-sm font-medium',
      'hover:bg-gray-100',
      'focus:outline-none focus:ring-2'
    )
    expect(result).toContain('text-sm')
    expect(result).toContain('font-medium')
    expect(result).toContain('hover:bg-gray-100')
    expect(result).toContain('focus:outline-none')
    expect(result).toContain('focus:ring-2')
  })
})
