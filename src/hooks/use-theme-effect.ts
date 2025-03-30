import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function useThemeEffect() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // 检测系统是否支持深色模式
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const storedTheme = localStorage.getItem('theme')

    // 如果用户之前没有设置过主题，则根据系统偏好设置
    if (!storedTheme) {
      setTheme(isDarkMode ? 'dark' : 'light')
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setTheme])
} 