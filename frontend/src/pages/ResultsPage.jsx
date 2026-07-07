import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChartBar as BarChart3 } from '@phosphor-icons/react'
import { getResult } from '../api/results'
import { getAllStudents } from '../api/students'
import { GradeBadge } from '../components/shared/GradeBadge'
import { EmptyState } from '../components/shared/EmptyState'
import { Masthead } from '../components/shared/Masthead'
import { Seal } from '../components/shared/Seal'
import { Skeleton } from '../components/ui/skeleton'
import { Label } from '../components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '../components/ui/table'

/* PASS/FAIL rendered as an inked rubber stamp pressed onto the transcript. */
function VerdictStamp({ status }) {
  const map = {
    PASS: { label: 'Passed', cls: 'border-ink-green/70 text-ink-green bg-ink-green/[0.06]', rot: '-5deg' },
    FAIL: { label: 'Failed', cls: 'border-ink-red/70 text-ink-red bg-ink-red/[0.06]', rot: '4deg' },
  }
  const v =
    map[status] ?? {
      label: 'No Result',
      cls: 'border-muted-foreground/60 text-muted-foreground bg-muted/40',
      rot: '-2deg',
    }
  return (
    <span
      className={`stamp-in stamp select-none rounded-sm border-[3px] px-5 py-2 text-xl tracking-[0.12em] ${v.cls}`}
      style={{ '--rot': v.rot, transform: `rotate(${v.rot})` }}
    >
      {v.label}
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
      <Masthead
        index="04"
        title="Results"
        subtitle="Official examination transcript, issued per student."
      />

      <div className="ink-rise d-1 mb-8 max-w-sm">
        <Label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Student
        </Label>
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
          title="No transcript selected"
          description="Choose a student to issue their examination transcript."
        />
      ) : isLoading ? (
        <ResultSkeleton />
      ) : isError ? (
        <div className="sheet rounded-sm border-l-2 border-destructive p-6 text-sm text-destructive">
          Unable to issue transcript — the student may have no marks recorded.
        </div>
      ) : (
        <Transcript result={result} />
      )}
    </div>
  )
}

function Transcript({ result }) {
  const hasSubjects = result.subjects?.length > 0

  return (
    <div className="sheet engraved ink-rise rounded-sm p-8 sm:p-10">
      {/* Letterpress header */}
      <div className="flex items-start justify-between gap-6 border-b-[3px] border-double border-foreground/50 pb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-primary">
            <Seal className="h-6 w-6" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">
              Official Transcript
            </p>
          </div>
          <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
            {result.studentName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Roll No.{' '}
            <span className="stamp rounded-sm border-foreground/25 bg-foreground/[0.04] px-1.5 py-0.5 text-[11px] text-foreground/80">
              {result.rollNumber}
            </span>
          </p>
        </div>
        <div className="flex-shrink-0 pt-1">
          <VerdictStamp status={result.status} />
        </div>
      </div>

      {/* Marks ledger */}
      {hasSubjects ? (
        <div className="mt-7 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/30 text-left font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                <th className="pb-2 pr-4 font-bold">Subject</th>
                <th className="pb-2 px-4 text-right font-bold">Marks</th>
                <th className="pb-2 px-4 text-right font-bold">Max</th>
                <th className="pb-2 px-4 text-right font-bold">%</th>
                <th className="pb-2 pl-4 text-right font-bold">Grade</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((s, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium">{s.subjectName}</td>
                  <td className="py-3 px-4 text-right font-mono text-base font-bold tabular-nums">
                    {s.marksObtained}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-muted-foreground">
                    {s.maxMarks}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {((s.marksObtained / s.maxMarks) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <GradeBadge grade={s.grade} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-7 text-sm italic text-muted-foreground">
          No marks have been recorded for this student yet.
        </p>
      )}

      {/* Ledger footer: the tallied result */}
      <div className="mt-8 grid grid-cols-2 gap-6 border-t-[3px] border-double border-foreground/50 pt-6 sm:grid-cols-3">
        <Tally label="Total Marks">
          <span className="font-display text-3xl text-foreground">{result.totalMarksObtained}</span>
          <span className="font-mono text-sm text-muted-foreground"> / {result.totalMaxMarks}</span>
        </Tally>
        <Tally label="Percentage">
          <span className="font-display text-3xl text-foreground">
            {result.overallPercentage?.toFixed(2)}
            <span className="text-xl">%</span>
          </span>
        </Tally>
        <Tally label="Verdict">
          <span
            className={
              result.status === 'PASS'
                ? 'font-display text-3xl text-ink-green'
                : result.status === 'FAIL'
                  ? 'font-display text-3xl text-ink-red'
                  : 'font-display text-3xl text-muted-foreground'
            }
          >
            {result.status === 'PASS' ? 'Passed' : result.status === 'FAIL' ? 'Failed' : '—'}
          </span>
        </Tally>
      </div>

      {/* Registrar's footer line */}
      <div className="mt-8 flex items-end justify-between">
        <p className="max-w-xs text-[11px] italic leading-snug text-muted-foreground">
          Issued from the office of the registrar. Grades computed under the standard scheme.
        </p>
        <div className="text-right">
          <div className="mb-1 h-8 w-40 border-b border-foreground/40" />
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Registrar's signature
          </p>
        </div>
      </div>
    </div>
  )
}

function Tally({ label, children }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 tabular-nums">{children}</p>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="sheet rounded-sm p-8">
      <Skeleton className="mb-3 h-4 w-32" />
      <Skeleton className="mb-2 h-9 w-64" />
      <Skeleton className="h-4 w-28" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    </div>
  )
}
