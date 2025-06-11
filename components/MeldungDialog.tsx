import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MeldungData, MeldungPoint } from "@/lib/types"
import { CATEGORIES, SUBCATEGORIES } from "@/lib/constants"

interface MeldungDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPoint: MeldungPoint | null
  formData: MeldungData
  onFormDataChange: (data: MeldungData) => void
  onSave: () => void
}

export function MeldungDialog({
  open,
  onOpenChange,
  selectedPoint,
  formData,
  onFormDataChange,
  onSave,
}: MeldungDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              placeholder="Titel der Meldung"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Hauptkategorie</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => onFormDataChange({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Unterkategorie</Label>
            <Select
              value={formData.subcategory}
              onValueChange={(value) => onFormDataChange({ ...formData, subcategory: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unterkategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                {SUBCATEGORIES.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              placeholder="Beschreibung der Meldung"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examples">Beispiele (jede Zeile ein Eintrag)</Label>
            <Textarea
              id="examples"
              value={formData.examples}
              onChange={(e) => onFormDataChange({ ...formData, examples: e.target.value })}
              placeholder="z. B. Baustellen: Fehlende Absperrungen&#10;Kaputte Gehwege&#10;Schlaglöcher"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Bewertung (1-10)</Label>
            <Select
              value={formData.rating}
              onValueChange={(value) => onFormDataChange({ ...formData, rating: value })}
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
              Speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 