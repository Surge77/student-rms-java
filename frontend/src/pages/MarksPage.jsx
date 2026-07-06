import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, PencilSimple as Pencil, ClipboardText as ClipboardList, CircleNotch as Loader2 } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { getMarksByStudent, createMark, updateMark } from '../api/marks'
import { getAllStudents } from '../api/students'
import { getAllSubjects } from '../api/subjects'
import { markSchema, updateMarkSchema } from '../lib/schemas'
import { useAuth } from '../store/AuthContext'
import { GradeBadge } from '../components/shared/GradeBadge'
import { EmptyState } from '../components/shared/EmptyState'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Skeleton } from '../components/ui/skeleton'
import { Alert } from '../components/ui/alert'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '../components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select'

export function MarksPage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [formError, setFormError] = useState('')

  const { data: studentsData } = useQuery({
    queryKey: ['all-students'],
    queryFn: getAllStudents,
  })

  const { data: subjectsData } = useQuery({
    queryKey: ['all-subjects'],
    queryFn: getAllSubjects,
  })

  const { data: marks, isLoading: marksLoading } = useQuery({
    queryKey: ['marks', selectedStudentId],
    queryFn: () => getMarksByStudent(selectedStudentId),
    enabled: !!selectedStudentId,
  })

  const invalidateMarks = () =>
    queryClient.invalidateQueries({ queryKey: ['marks', selectedStudentId] })

  const createMutation = useMutation({
    mutationFn: createMark,
    onSuccess: () => { invalidateMarks(); setAddOpen(false); toast.success('Mark recorded') },
    onError: (e) => setFormError(e.response?.data?.message ?? 'Failed to record mark'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMark(id, data),
    onSuccess: () => { invalidateMarks(); setEditTarget(null); toast.success('Mark updated') },
    onError: (e) => setFormError(e.response?.data?.message ?? 'Failed to update mark'),
  })

  const students = studentsData?.content ?? []
  const subjects = subjectsData?.content ?? []
  const selectedStudent = students.find((s) => String(s.id) === selectedStudentId)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marks</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Select a student to view or manage their marks
          </p>
        </div>
        {isAdmin && selectedStudentId && (
          <Button onClick={() => { setFormError(''); setAddOpen(true) }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Mark
          </Button>
        )}
      </div>

      {/* Student selector */}
      <div className="mb-6 max-w-sm">
        <Label className="mb-1.5 block">Student</Label>
        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a student…" />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name} — {s.rollNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Marks table */}
      {!selectedStudentId ? (
        <EmptyState
          icon={ClipboardList}
          title="No student selected"
          description="Choose a student from the dropdown to view their marks."
        />
      ) : marksLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !marks || marks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No marks recorded"
          description={`${selectedStudent?.name ?? 'This student'} has no marks yet.`}
          action={isAdmin && <Button onClick={() => setAddOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Add Mark</Button>}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Marks Obtained</TableHead>
              <TableHead>Max Marks</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Grade</TableHead>
              {isAdmin && <TableHead className="w-20 text-right">Edit</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {marks.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.subjectName}</TableCell>
                <TableCell className="font-mono tabular-nums">{m.marksObtained}</TableCell>
                <TableCell className="font-mono tabular-nums text-muted-foreground">{m.maxMarks}</TableCell>
                <TableCell className="font-mono tabular-nums">
                  {((m.marksObtained / m.maxMarks) * 100).toFixed(1)}%
                </TableCell>
                <TableCell><GradeBadge grade={m.grade} /></TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setFormError(''); setEditTarget(m) }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add mark dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Mark</DialogTitle></DialogHeader>
          <AddMarkForm
            studentId={selectedStudentId}
            subjects={subjects}
            onSubmit={(d) => createMutation.mutate(d)}
            loading={createMutation.isPending}
            error={formError}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button form="mark-form" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Mark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit mark dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mark — {editTarget?.subjectName}</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <EditMarkForm
              mark={editTarget}
              onSubmit={(d) => updateMutation.mutate({ id: editTarget.id, data: d })}
              loading={updateMutation.isPending}
              error={formError}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button form="edit-mark-form" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Mark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddMarkForm({ studentId, subjects, onSubmit, loading, error }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(markSchema),
    defaultValues: { studentId: Number(studentId) },
  })
  return (
    <form id="mark-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Alert message={error} />
      <input type="hidden" {...register('studentId')} />
      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Select onValueChange={(v) => setValue('subjectId', Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject…" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name} (max {s.maxMarks})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subjectId && <p className="text-xs text-red-400">Select a subject</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Marks Obtained</Label>
        <Input type="number" min={0} placeholder="e.g. 82" {...register('marksObtained')} />
        {errors.marksObtained && <p className="text-xs text-red-400">{errors.marksObtained.message}</p>}
      </div>
    </form>
  )
}

function EditMarkForm({ mark, onSubmit, loading, error }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(updateMarkSchema),
    defaultValues: { marksObtained: mark.marksObtained },
  })
  return (
    <form id="edit-mark-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Alert message={error} />
      <div className="space-y-1.5">
        <Label>Marks Obtained (max {mark.maxMarks})</Label>
        <Input type="number" min={0} max={mark.maxMarks} {...register('marksObtained')} />
        {errors.marksObtained && <p className="text-xs text-red-400">{errors.marksObtained.message}</p>}
      </div>
    </form>
  )
}
