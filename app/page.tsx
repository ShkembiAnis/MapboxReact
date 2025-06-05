"use client"

import { useState, useCallback } from "react"
import { useMapbox } from "@/hooks/useMapbox"
import { MeldungOverlay } from "@/components/MeldungOverlay"
import { MeldungDialog } from "@/components/MeldungDialog"
import { MeldungData, MeldungPoint } from "@/lib/types"

export default function MapboxMeldungApp() {
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

  const handleMarkerClick = (point: MeldungPoint) => {
    setSelectedPoint(point)
    setShowOverlay(true)
    if (point.data) {
      setFormData(point.data)
    } else {
      setFormData({
        title: "",
        category: "",
        subcategory: "",
        description: "",
        examples: "",
        rating: "",
      })
    }
  }

  const { mapContainer } = useMapbox(handleMapClick, points, handleMarkerClick)

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

  const handleDeletePoint = () => {
    if (selectedPoint) {
      setPoints((prev) => prev.filter((point) => point.id !== selectedPoint.id))
      setShowOverlay(false)
      setSelectedPoint(null)
    }
  }

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Overlay */}
      {showOverlay && selectedPoint && (
        <MeldungOverlay
          selectedPoint={selectedPoint}
          onClose={handleCloseOverlay}
          onEdit={() => setShowDialog(true)}
          onDelete={handleDeletePoint}
        />
      )}

      {/* Dialog */}
      <MeldungDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedPoint={selectedPoint}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSaveMeldung}
      />

      {/* Mapbox CSS */}
      <style jsx global>{`
        @import url('https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css');
      `}</style>
    </div>
  )
}
