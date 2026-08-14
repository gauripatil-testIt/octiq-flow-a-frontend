import {
  type Control,
  type FieldValues,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
  Controller,
} from 'react-hook-form'
import { FormField } from '../../shared/components/FormField'

interface EmployeeSection1FieldsProps {
  control: Control<FieldValues>
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  watch: UseFormWatch<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  isEdit: boolean
}

export function EmployeeSection1Fields({
  control,
  register,
  errors,
  watch,
  setValue,
  isEdit,
}: EmployeeSection1FieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-6 sm:grid-cols-2">
      <FormField
        htmlFor="name"
        label="Name"
        required
        error={errors.name?.message as string | undefined}
      >
        <input
          id="name"
          type="text"
          {...register('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          placeholder="Enter Name"
          className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </FormField>
      <FormField
        htmlFor="email"
        label="Email"
        required
        error={errors.email?.message as string | undefined}
      >
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          placeholder="name@example.com"
          className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </FormField>
      <FormField
        htmlFor="department"
        label="Department"
        required
        error={errors.department?.message as string | undefined}
      >
        <input
          id="department"
          type="text"
          {...register('department')}
          aria-invalid={Boolean(errors.department)}
          aria-describedby={errors.department ? 'department-error' : undefined}
          placeholder="Enter Department"
          className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </FormField>
      <FormField
        htmlFor="role"
        label="Role"
        required
        error={errors.role?.message as string | undefined}
      >
        <input
          id="role"
          type="text"
          {...register('role')}
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? 'role-error' : undefined}
          placeholder="Enter Role"
          className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </FormField>
      <FormField
        htmlFor="salary"
        label="Salary"
        required
        error={errors.salary?.message as string | undefined}
      >
        <div className="flex items-center rounded-lg border border-border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <button
            type="button"
            onClick={() => setValue('salary', Math.max(0, Number(watch('salary') ?? 0) - 1) as any)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-lg border-r border-border text-foreground/60 hover:bg-background hover:text-foreground transition-colors select-none"
            aria-label="Decrease Salary"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <input
            id="salary"
            type="number"
            {...register('salary')}
            aria-invalid={Boolean(errors.salary)}
            aria-describedby={errors.salary ? 'salary-error' : undefined}
            placeholder="0"
            className="block w-full bg-transparent px-2 py-2.5 text-center text-sm text-foreground placeholder:text-foreground/40 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setValue('salary', (Number(watch('salary') ?? 0) + 1) as any)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-r-lg border-l border-border text-foreground/60 hover:bg-background hover:text-foreground transition-colors select-none"
            aria-label="Increase Salary"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </FormField>
      <FormField
        htmlFor="status"
        label="Status"
        required
        error={errors.status?.message as string | undefined}
      >
        <Controller
          name="status"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <select
              id="status"
              {...field}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? 'status-error' : undefined}
              className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select…</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          )}
        />
      </FormField>
      <FormField
        htmlFor="joiningDate"
        label="Joining Date"
        error={errors.joiningDate?.message as string | undefined}
      >
        <input
          id="joiningDate"
          type="text"
          {...register('joiningDate')}
          aria-invalid={Boolean(errors.joiningDate)}
          aria-describedby={errors.joiningDate ? 'joiningDate-error' : undefined}
          placeholder="Enter Joiningdate"
          className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </FormField>
    </div>
  )
}
