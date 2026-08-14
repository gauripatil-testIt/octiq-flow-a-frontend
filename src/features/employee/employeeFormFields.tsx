import { useState } from 'react'
import {
  type Control,
  type FieldValues,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
} from 'react-hook-form'
import { EmployeeSection1Fields } from './EmployeeSection1Fields'

interface EmployeeFormFieldsProps {
  control: Control<FieldValues>
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  watch: UseFormWatch<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  isEdit: boolean
}

export function EmployeeFormFields({
  control,
  register,
  errors,
  watch,
  setValue,
  isEdit,
}: EmployeeFormFieldsProps) {
  const [openSections, setOpenSections] = useState<boolean[]>(Array(1).fill(true))

  return (
    <>
      {/* Section: Details */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <button
          type="button"
          onClick={() => setOpenSections((s) => s.map((v, j) => (j === 0 ? !v : v)))}
          className="flex w-full items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-foreground">Details</h2>
          </div>
          <svg
            className={`h-5 w-5 text-foreground/40 transition-transform duration-200${openSections[0] ? ' rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openSections[0] && (
          <EmployeeSection1Fields
            control={control}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            isEdit={isEdit}
          />
        )}
      </div>
    </>
  )
}
