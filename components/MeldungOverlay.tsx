import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MeldungPoint } from "@/lib/types"

interface MeldungOverlayProps {
  selectedPoint: MeldungPoint
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function MeldungOverlay({ selectedPoint, onClose, onEdit, onDelete }: MeldungOverlayProps) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <Card className="w-80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">{selectedPoint.data?.title || "Neue Meldung"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
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
              <div className="flex gap-2">
                <Button onClick={onEdit} className="flex-1" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Bearbeiten
                </Button>
                <Button onClick={onDelete} className="flex-1" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 flex-start flex">No additional information</p>
              <div className="flex gap-2 flex-row items-center justify-center">
                <Button onClick={onEdit} className="w-full bg-green-600 hover:bg-green-700 p-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Meldung hinzufügen
                </Button>
                <Button onClick={onDelete} className="w-full p-2" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 