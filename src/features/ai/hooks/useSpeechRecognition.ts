import { useState, useEffect, useRef, useCallback } from 'react'

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  startListening: () => void
  stopListening: () => void
  isSupported: boolean
  error: string | null
}

/**
 * Custom hook for Web Speech API integration
 * Provides speech-to-text functionality with real-time transcription
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognitionAPI) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognitionAPI()

      const recognition = recognitionRef.current

      // Configure recognition
      recognition.continuous = false // Stop after user finishes speaking
      recognition.interimResults = true // Get real-time results
      recognition.lang = 'en-US'

      // Handle results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interim = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcriptPiece = result[0].transcript

          if (result.isFinal) {
            finalTranscript += transcriptPiece + ' '
          } else {
            interim += transcriptPiece
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
        }
        setInterimTranscript(interim)
      }

      // Handle start
      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      // Handle end
      recognition.onend = () => {
        setIsListening(false)
        setInterimTranscript('')
      }

      // Handle errors
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)

        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try again.')
            break
          case 'audio-capture':
            setError('Microphone not found. Please check your device.')
            break
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone access.')
            break
          case 'network':
            setError('Network error. Please check your connection.')
            break
          default:
            setError('Speech recognition error. Please try again.')
        }
      }
    } else {
      setIsSupported(false)
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition is not available.')
      return
    }

    try {
      // Reset state
      setTranscript('')
      setInterimTranscript('')
      setError(null)

      // Start recognition
      recognitionRef.current.start()
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition.')
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    isSupported,
    error,
  }
}
