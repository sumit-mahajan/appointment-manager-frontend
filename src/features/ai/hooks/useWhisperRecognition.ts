import { useState, useRef, useCallback } from 'react'
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api.constants'
import { useAuthStore } from '@/features/auth/store/auth.store'

export interface UseWhisperRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  startListening: () => void
  stopListening: () => void
  isSupported: boolean
  error: string | null
  isTranscribing: boolean
}

/**
 * Records audio via MediaRecorder and transcribes via POST /voice/transcribe.
 * Gemini (free) is used server-side; Whisper is fallback if configured.
 */
export function useWhisperRecognition(): UseWhisperRecognitionReturn {
  const { token } = useAuthStore()
  const [isListening, setIsListening] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const isSupported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined'

  const transcribeBlob = useCallback(
    async (blob: Blob) => {
      setIsTranscribing(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', blob, 'recording.webm')

        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.VOICE_TRANSCRIBE}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        )

        const json = await response.json()

        if (!response.ok) {
          throw new Error(json.error || 'Transcription failed')
        }

        const text = json.data?.transcript as string
        if (!text?.trim()) {
          throw new Error('No speech detected. Please try again.')
        }

        setTranscript(text.trim())
        setInterimTranscript('')
      } catch (err) {
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone access.')
        } else if (err instanceof TypeError) {
          setError('Network error. Please check your connection.')
        } else {
          setError(
            err instanceof Error ? err.message : 'Transcription failed.'
          )
        }
      } finally {
        setIsTranscribing(false)
      }
    },
    [token]
  )

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recording is not supported in this browser.')
      return
    }

    try {
      setTranscript('')
      setInterimTranscript('')
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: mimeType })
        if (blob.size > 0) {
          await transcribeBlob(blob)
        }
        setIsListening(false)
      }

      recorder.onerror = () => {
        setError('Recording failed. Please try again.')
        setIsListening(false)
      }

      recorder.start()
      setIsListening(true)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access.')
      } else {
        setError('Could not start recording.')
      }
    }
  }, [isSupported, transcribeBlob])

  const stopListening = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
    }
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript: isTranscribing ? 'Transcribing…' : interimTranscript,
    startListening,
    stopListening,
    isSupported,
    error,
    isTranscribing,
  }
}
