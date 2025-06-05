import { useRef, useEffect } from 'react'
import { MeldungPoint } from '@/lib/types'
import { MAPBOX_TOKEN, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants'

export const useMapbox = (
  onMapClick: (lng: number, lat: number) => void,
  points: MeldungPoint[],
  onMarkerClick: (point: MeldungPoint) => void
) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Initialize map
  useEffect(() => {
    if (map.current) return

    const initializeMap = async () => {
      try {
        const mapboxgl = await import("mapbox-gl")

        if (mapContainer.current) {
          map.current = new mapboxgl.default.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: DEFAULT_MAP_CENTER,
            zoom: DEFAULT_MAP_ZOOM,
            accessToken: MAPBOX_TOKEN,
          })

          map.current.on("click", (e: any) => {
            const { lng, lat } = e.lngLat
            onMapClick(lng, lat)
          })
        }
      } catch (error) {
        console.error("Error loading Mapbox:", error)
      }
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [onMapClick])

  // Update markers when points change
  useEffect(() => {
    if (!map.current) return

    let isMounted = true;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add new markers
    points.forEach((point) => {
      const markerElement = document.createElement("div")
      markerElement.className =
        "w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
      markerElement.addEventListener("click", (e) => {
        e.stopPropagation()
        onMarkerClick(point)
      })

      const loadMapbox = async () => {
        try {
          const mapboxgl = await import("mapbox-gl")
          if (isMounted && map.current) {
            const marker = new mapboxgl.default.Marker(markerElement)
              .setLngLat([point.longitude, point.latitude])
              .addTo(map.current)
            markersRef.current.push(marker)
          }
        } catch (error) {
          console.error("Error creating marker:", error)
        }
      }

      loadMapbox()
    })

    return () => {
      isMounted = false;
    }
  }, [points, onMarkerClick])

  return { mapContainer }
} 