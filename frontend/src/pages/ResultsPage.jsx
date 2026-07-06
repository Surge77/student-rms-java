import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChartBar as BarChart3, TrendUp as TrendingUp, TrendDown as TrendingDown, Minus } from '@phosphor-icons/react'
import { getResult } from '../api/results'
import { getAllStudents } from '../api/students'
import { GradeBadge } from '../components/shared/GradeBadge'
import { EmptyState } from '../components/shared/EmptyState'
import { Skeleton } from '../components/ui/skeleton'
import { Label } from '../components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '../components/ui/table'

function StatusPill({ status }) {
  if (status === 'PASS') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-400">
        <TrendingUp className="h-3.5 w-3.5" /> PASS
      </span>
    )
  }
  if (status === 'FAIL') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-400">
        <TrendingDown className="h-3.5 w-3.5" /> FAIL
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
      <Minus className="h-3.5 w-3.5" /> NO RESULT
    </span>
  )
}

export function ResultsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState('')

  const { data: studentsData } = useQuery({
    queryKey: ['all-students'],
    queryFn: getAllStudents,
  })

  const { data: result, isLoading, isError } = useQuery({
    queryKey: ['result', selectedStudentId],
    queryFn: () => getResult(selectedStudentId),
    enabled: !!selectedStudentId,
  })

  const students = studentsData?.content ?? []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Results</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Academic result card per student
        </p>
      </div>

      {/* Student selector */}
      <div className="mb-8 max-w-sm">
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

      {!selectedStudentId ? (
        <EmptyState
          icon={BarChart3}
          title="No student selected"
          description="Select a student to view their academic result card."
        />
      ) : isLoading ? (
        <ResultSkeleton />
      ) : isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-red-400">
          Failed to load result. The student may have no marks recorded.
        </div>
      ) : (
        <ResultCard result={result} />
      )}
    </div>
  )
}

function ResultCard({ result }) {
  const hasSubjects = result.subjects?.length > 0

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Academic Result
            </p>
            <h2 className="mt-1 text-xl font-bold text-foreground">{result.studentName}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Roll No.{' '}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                {result.rollNumber}
              </span>
            </p>
          </div>
          <StatusPill status={result.status} />
        </div>
      </div>

      {/* Subject table */}
      {hasSubjects ? (
        <div className="p-6 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Max</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.subjects.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{s.subjectName}</TableCell>
                  <TableCell className="font-mono tabular-nums">{s.marksObtained}</TableCell>
                  <TableCell className="font-mono tabular-nums text-muted-foreground">{s.maxMarks}</TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {((s.marksObtained / s.maxMarks) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell><GradeBadge grade={s.grade} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-6 text-sm text-muted-foreground">
          No marks recorded for this student yet.
        </div>
      )}

      {/* Summary footer */}
      <div className="mt-6 border-t border-border px-6 py-5">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Marks</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
              {result.totalMarksObtained}
              <span className="text-sm font-normal text-muted-foreground">
                {' '}/{' '}{result.totalMaxMarks}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Percentage</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
              {result.overallPercentage?.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
            <div className="mt-1.5">
              <StatusPill status={result.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Skeleton className="mb-4 h-6 w-48" />
      <Skeleton className="mb-2 h-4 w-32" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    </div>
  )
}
