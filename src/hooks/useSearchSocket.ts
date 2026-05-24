import { WS_BASE_URL } from '@/config/api.config'
import { useEffect, useRef, useState } from 'react'

export type SearchSocketEvent =
  | {
      type: 'CONNECTED'
      message?: string
    }
  | {
      type: 'SUBSCRIBED_SEARCH'
      searchId: string
    }
  | {
      type: 'SEARCH_STARTED'
      searchId: string
      message?: string
    }
  | {
      type: 'PRODUCTS_FOUND'
      searchId: string
      total: number
      processed?: number
      message?: string
    }
  | {
      type: 'PRODUCT_SAVED'
      searchId: string
      processed: number
      total: number
      product: any
      message?: string
    }
  | {
      type: 'PRODUCT_FAILED'
      searchId: string
      processed?: number
      total?: number
      error?: string
      message?: string
    }
  | {
      type: 'SEARCH_COMPLETED'
      searchId: string
      processed: number
      total: number
      message?: string
    }
  | {
      type: 'SEARCH_FAILED'
      searchId: string
      error?: string
      message?: string
    }

export const useSearchSocket = ({
  searchId,
  enabled
}: {
  searchId?: string
  enabled: boolean
}) => {
  const socketRef = useRef<WebSocket | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [events, setEvents] = useState<SearchSocketEvent[]>([])

  useEffect(() => {
    if (!searchId || !enabled) return

    const socket = new WebSocket(WS_BASE_URL)
    socketRef.current = socket

    socket.onopen = () => {
      setIsConnected(true)

      socket.send(
        JSON.stringify({
          type: 'SUBSCRIBE_SEARCH',
          searchId
        })
      )
    }

    socket.onmessage = message => {
      try {
        const event = JSON.parse(message.data) as SearchSocketEvent
        setEvents(prev => [...prev, event])
      } catch (error) {
        console.error('Invalid socket event:', error)
      }
    }

    socket.onerror = error => {
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      setIsConnected(false)
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'UNSUBSCRIBE_SEARCH',
            searchId
          })
        )
      }

      socket.close()
    }
  }, [searchId, enabled])

  return {
    events,
    isConnected
  }
}