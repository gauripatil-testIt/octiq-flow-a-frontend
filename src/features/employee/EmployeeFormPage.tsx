import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  useForm,
  Controller,
  type Control,
  type FieldValues,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { normalizeApiRecord } from '../../shared/utils/formatters'
import { FormPageHeader } from '../../shared/components/FormPageHeader'
import { type EmployeeRequest, isAbortError, getEmployeeById } from './employeeApi'
import { useEmployeeForm } from './useEmployeeForm'
import { EmployeeFormFields } from './employeeFormFields'

// ── Zod schema (aligned with backend DTO validation) ───────────────────────
const employeeBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2).max(120),
  email: z.string().min(1, 'Email is required').email('Enter a valid email').max(255),
  department: z.string().min(1, 'Department is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  salary: z.coerce.number().int().min(0),
  status: z.union([z.literal(''), z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'])]),
  joiningDate: z.string().optional(),
})

type EmployeeFormData = z.infer<typeof employeeBaseSchema>
function buildEmployeeSchema(isEdit: boolean) {
  return employeeBaseSchema.superRefine((data, ctx) => {
    if (!data.status) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Status is required', path: ['status'] })
    }
  })
}

function toEmployeeFormData(value: unknown): EmployeeFormData {
  const record = normalizeApiRecord(
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {},
  )
  return employeeBaseSchema.parse({
    ...record,
    status: (['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'] as string[]).includes(
      String(record.status),
    )
      ? (record.status as string)
      : '',
  })
}

function toEmployeeRequest(data: EmployeeFormData): EmployeeRequest {
  return {
    ...data,
  }
}

export default function EmployeeFormPage() {
  const { id, isEdit, serverError, setServerError, submit } = useEmployeeForm()
  const employeeSchema = useMemo(() => buildEmployeeSchema(isEdit), [isEdit])

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    const controller = new AbortController()
    if (isEdit && id) {
      getEmployeeById(id, { signal: controller.signal })
        .then((data) => {
          const formData = toEmployeeFormData(data)
          reset(formData)
        })
        .catch((e) => {
          if (!isAbortError(e)) setServerError(String(e))
        })
    }
    return () => controller.abort()
  }, [id, isEdit, reset])

  const onSubmit = (data: EmployeeFormData) => submit(toEmployeeRequest(data), reset)

  return (
    <div className="relative space-y-6">
      <FormPageHeader
        backHref="/employees"
        backLabel="Back to Employees"
        subtitle={
          isEdit ? 'Update the details for this employee' : 'Add a new employee to your records'
        }
        serverError={serverError}
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <EmployeeFormFields
          control={control as Control<FieldValues>}
          register={register as UseFormRegister<FieldValues>}
          errors={errors as FieldErrors<FieldValues>}
          watch={watch as UseFormWatch<FieldValues>}
          setValue={setValue as UseFormSetValue<FieldValues>}
          isEdit={isEdit}
        />
        {/* Actions row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              aria-busy={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  {isEdit ? 'Save changes' : 'Create Employee'}
                </>
              )}
            </button>
            <Link
              to="/employees"
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-background hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
            >
              Cancel
            </Link>
          </div>
          <p className="hidden text-xs text-foreground/40 sm:flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
            Fields marked with <span className="text-error mx-0.5">*</span> are required
          </p>
        </div>
      </form>
    </div>
  )
}
