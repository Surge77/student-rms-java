import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, PencilSimple as Pencil, Trash as Trash2, Users, CaretLeft as ChevronLeft, CaretRight as ChevronRight, CircleNotch as Loader2 } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/students'
import { studentSchema } from '../lib/schemas'
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

function StudentForm({ defaultValues, onSubmit, loading, error }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues,
  })
  return (
    <form id="student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Alert message={error} />
      <div className="space-y-1.5">
        <Label>Full Name</Label>
        <Input placeholder="e.g. Asha Reddy" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input type="email" placeholder="e.g. asha@example.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Roll Number</Label>
        <Input placeholder="e.g. CS-101" {...register('rollNumber')} />
        {errors.rollNumber && <p className="text-xs text-destructive">{errors.rollNumber.message}</p>}
      </div>
    </form>
  )
}

export function StudentsPage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['students', page],
    queryFn: () => getStudents(page),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['students'] })

  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => { invalidate(); setAddOpen(false); toast.success('Student added') },
    onError: (e) => setFormError(e.response?.data?.message ?? 'Failed to add student'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateStudent(id, data),
    onSuccess: () => { invalidate(); setEditTarget(null); toast.success('Student updated') },
    onError: (e) => setFormError(e.response?.data?.message ?? 'Failed to update student'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => { invalidate(); setDeleteTarget(null); toast.success('Student deleted') },
    onError: () => toast.error('Failed to delete student'),
  })

  const students = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div>
      <Masthead
        index="01"
        title="Students"
        subtitle="The enrolment register."
        meta={data ? `${data.totalElements} on record` : 'Loading…'}
        action={
          isAdmin && (
            <Button onClick={() => { setFormError(''); setAddOpen(true) }}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Student
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="Add the first student to get started."
          action={isAdmin && <Button onClick={() => setAddOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Add Student</Button>}
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                {isAdmin && <TableHead className="w-24 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <span className="stamp rounded-sm border-foreground/25 bg-foreground/[0.04] px-1.5 py-0.5 text-[11px] text-foreground/80">
                      {s.rollNumber}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="italic text-muted-foreground">{s.email}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => { setFormError(''); setEditTarget(s) }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteTarget(s)}
                        >
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
                <Button size="sm" variant="outline" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
          <StudentForm
            onSubmit={(d) => createMutation.mutate(d)}
            loading={createMutation.isPending}
            error={formError}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button form="student-form" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
          {editTarget && (
            <StudentForm
              defaultValues={editTarget}
              onSubmit={(d) => updateMutation.mutate({ id: editTarget.id, data: d })}
              loading={updateMutation.isPending}
              error={formError}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button form="student-form" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Student"
        description={`Remove "${deleteTarget?.name}"? This will also delete their marks.`}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
