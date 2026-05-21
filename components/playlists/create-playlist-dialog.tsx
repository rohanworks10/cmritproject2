'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { usePlaylist } from '@/contexts/playlist-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { playlistNameExists } from '@/lib/playlist/playlistService'

interface CreatePlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function CreatePlaylistDialog({
  open,
  onOpenChange,
  onCreated,
}: CreatePlaylistDialogProps) {
  const { createPlaylist, isSaving } = usePlaylist()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleCreate = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Enter a playlist name')
      return
    }
    if (playlistNameExists(trimmed)) {
      setError('A playlist with this name already exists')
      return
    }

    setError(null)
    const playlist = await createPlaylist(trimmed)
    if (playlist) {
      setSuccess(true)
      setName('')
      onCreated?.()
      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
      }, 600)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setName('')
      setError(null)
      setSuccess(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create playlist</DialogTitle>
          <DialogDescription>Give your playlist a unique name</DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Playlist name..."
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          autoFocus
          disabled={isSaving}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && (
          <p className="text-sm text-primary">Playlist created successfully!</p>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 gap-2"
            onClick={handleCreate}
            disabled={isSaving || !name.trim()}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
