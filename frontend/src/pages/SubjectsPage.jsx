import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, PencilSimple as Pencil, Trash as Trash2, BookOpen, CaretLeft as ChevronLeft, CaretRight as ChevronRight, CircleNotch as Loader2 } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../api/subjects'
import { subjectSchema } from '../lib/schemas'
import { useAuth } from '../store/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Skeleton } from '../components/ui/skeleton'
import { Alert } from '../components/ui/alert'
import { EmptyState } from '../components/shared/EmptyState'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { Masthead } from '../components/shared/Masthead'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '../components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../components/ui/dialog'

function SubjectForm({ defaultValues, onSubmit, error }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues,
  })
  return (
    <form id="subject-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Alert message={error} />
      <div className="space-y-1.5">
        <Label>Subject Name</Label>
        <Input placeholder="e.g. Mathematics" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Maximum Marks</Label>
        <Input type="number" placeholder="e.g. 100" {...register('maxMarks')} />
        {errors.maxMarks && <p className="text-xs text-destructive">{errors.maxMarks.message}</p>}
      </div>
    </form>
  )
}

export function SubjectsPage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['subjects', page],
    queryFn: () => getSubjects(page),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['subjects'] })

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => { invalidate(); setAddOpen(false); toast.success('Subject added') },
    onError: (e) => setFormError(e.response?.data?.message ?? 'Failed to add subject'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSubject(id, data),
    onSuccess: () => { invalidate(); setEditTarget(null); toast.success('Subject updated') },
    onError: (e) => setFormError(e.response?.data?.message ?? 'Failed to update subject'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => { invalidate(); setDeleteTarget(null); toast.success('Subject deleted') },
    onError: () => toast.error('Failed to delete subject'),
  })

  const subjects = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div>
      <Masthead
        index="02"
        title="Subjects"
        subtitle="The syllabus of record."
        meta={data ? `${data.totalElements} subjects` : 'Loading…'}
        action={
          isAdmin && (
            <Button onClick={() => { setFormError(''); setAddOpen(true) }}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Subject
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Add subjects before assigning marks."
          action={isAdmin && <Button onClick={() => setAddOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Add Subject</Button>}
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Max Marks</TableHead>
                {isAdmin && <TableHead className="w-24 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm tabular-nums text-foreground/80">
                      / {s.maxMarks}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setFormError(''); setEditTarget(s) }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteTarget(s)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Page {page + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Subject</DialogTitle></DialogHeader>
          <SubjectForm onSubmit={(d) => createMutation.mutate(d)} error={formError} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button form="subject-form" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Subject</DialogTitle></DialogHeader>
          {editTarget && (
            <SubjectForm
              defaultValues={editTarget}
              onSubmit={(d) => updateMutation.mutate({ id: editTarget.id, data: d })}
              error={formError}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button form="subject-form" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Subject"
        description={`Remove "${deleteTarget?.name}"?`}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
