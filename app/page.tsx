"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MeldungData {
  title: string
  category: string
  subcategory: string
  description: string
  examples: string
  rating: string
}

interface MeldungPoint {
  id: string
  longitude: number
  latitude: number
  data?: MeldungData
}

const MAPBOX_TOKEN = "pk.eyJ1IjoiYW5vamEiLCJhIjoiY203ZXplcTl1MGhqYTJrcjB4N2duOWNmNCJ9.9zUulGIaw0X8lAFidfeWNg"

export default function MapboxMeldungApp() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  const [points, setPoints] = useState<MeldungPoint[]>([])
  const [selectedPoint, setSelectedPoint] = useState<MeldungPoint | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [formData, setFormData] = useState<MeldungData>({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    examples: "",
    rating: "",
  })

  // Initialize map
  useEffect(() => {
    if (map.current) return // Initialize map only once

    const initializeMap = async () => {
      try {
        // Dynamically import mapbox-gl
        const mapboxgl = await import("mapbox-gl")

        if (mapContainer.current) {
          map.current = new mapboxgl.default.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-97.7431, 30.2672], // Austin, TX
            zoom: 10,
            accessToken: MAPBOX_TOKEN,
          })

          // Add click event listener
          map.current.on("click", (e: any) => {
            const { lng, lat } = e.lngLat
            handleMapClick(lng, lat)
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
  }, [])

  // Update markers when points change
  useEffect(() => {
    if (!map.current) return

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
        handleMarkerClick(point)
      })

      const loadMapbox = async () => {
        try {
          const mapboxgl = await import("mapbox-gl")
          const marker = new mapboxgl.default.Marker(markerElement)
            .setLngLat([point.longitude, point.latitude])
            .addTo(map.current)

          markersRef.current.push(marker)
        } catch (error) {
          console.error("Error creating marker:", error)
        }
      }

      loadMapbox()
    })
  }, [points])

  const handleMapClick = useCallback((lng: number, lat: number) => {
    const newPoint: MeldungPoint = {
      id: Date.now().toString(),
      longitude: lng,
      latitude: lat,
    }

    setPoints((prev) => [...prev, newPoint])
    setSelectedPoint(newPoint)
    setShowOverlay(true)
    setFormData({
      title: "",
      category: "",
      subcategory: "",
      description: "",
      examples: "",
      rating: "",
    })
  }, [])

  const handleOpenDialog = () => {
    setShowDialog(true)
  }

  const handleSaveMeldung = () => {
    if (selectedPoint) {
      const updatedPoint = {
        ...selectedPoint,
        data: formData,
      }

      setPoints((prev) => prev.map((point) => (point.id === selectedPoint.id ? updatedPoint : point)))

      setSelectedPoint(updatedPoint)
      setShowDialog(false)
    }
  }

  const handleCloseOverlay = () => {
    setShowOverlay(false)
    setSelectedPoint(null)
  }

  const handleMarkerClick = (point: MeldungPoint) => {
    setSelectedPoint(point)
    setShowOverlay(true)
    if (point.data) {
      setFormData(point.data)
    }
  }

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Overlay */}
      {showOverlay && selectedPoint && (
        <div className="absolute top-4 left-4 z-10">
          <Card className="w-80 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{selectedPoint.data?.title || "Neue Meldung"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCloseOverlay} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPoint.data ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Hauptkategorie</Label>
                    <p className="text-sm">{selectedPoint.data.category}</p>
                  </div>
                  {selectedPoint.data.subcategory && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Unterkategorie</Label>
                      <p className="text-sm">{selectedPoint.data.subcategory}</p>
                    </div>
                  )}
                  {selectedPoint.data.description && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Beschreibung</Label>
                      <p className="text-sm">{selectedPoint.data.description}</p>
                    </div>
                  )}
                  {selectedPoint.data.examples && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Beispiele</Label>
                      <p className="text-sm">{selectedPoint.data.examples}</p>
                    </div>
                  )}
                  {selectedPoint.data.rating && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Bewertung</Label>
                      <p className="text-sm">{selectedPoint.data.rating}/10</p>
                    </div>
                  )}
                  <Button onClick={handleOpenDialog} className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">No additional information</p>
                  <Button onClick={handleOpenDialog} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Meldung hinzufügen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPoint?.data ? "Meldung bearbeiten" : "Neue Meldung"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Titel der Meldung"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Hauptkategorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zu Fuß">Zu Fuß</SelectItem>
                  <SelectItem value="Fahrrad">Fahrrad</SelectItem>
                  <SelectItem value="Auto">Auto</SelectItem>
                  <SelectItem value="ÖPNV">ÖPNV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Unterkategorie</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unterkategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baustelle">Baustelle</SelectItem>
                  <SelectItem value="Schlagloch">Schlagloch</SelectItem>
                  <SelectItem value="Beleuchtung">Beleuchtung</SelectItem>
                  <SelectItem value="Sicherheit">Sicherheit</SelectItem>
                  <SelectItem value="Absperrung">Absperrung</SelectItem>
                  <SelectItem value="Gehweg">Gehweg</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Beschreibung der Meldung"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examples">Beispiele (jede Zeile ein Eintrag)</Label>
              <Textarea
                id="examples"
                value={formData.examples}
                onChange={(e) => setFormData((prev) => ({ ...prev, examples: e.target.value }))}
                placeholder="z. B. Baustellen: Fehlende Absperrungen&#10;Kaputte Gehwege&#10;Schlaglöcher"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Bewertung (1-10)</Label>
              <Select
                value={formData.rating}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, rating: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bewertung auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveMeldung} className="bg-green-600 hover:bg-green-700">
                Speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mapbox CSS */}
      <style jsx global>{`
        @import url('https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css');
      `}</style>
    </div>
  )
}
