import { describe, expect, it } from 'vitest'
import {
  matchDateValue,
  matchesSearchQuery,
  normalizeDateQuery,
  parseDateQuery,
  rowMatchesSearch,
} from './matchRowSearch'

const DEMO_SEARCH_FIELDS = {
  id: { kind: 'id' as const },
  name: { kind: 'text' as const },
  status: { kind: 'enum' as const, values: ['active', 'inactive', 'pending', 'archived'] as const },
  createdAt: { kind: 'date' as const },
  updatedAt: { kind: 'date' as const },
}

describe('normalizeDateQuery', () => {
  it('normalizes US slash format to ISO', () => {
    expect(normalizeDateQuery('03/15/2020')).toBe('2020-03-15')
  })

  it('normalizes ISO without leading zeros', () => {
    expect(normalizeDateQuery('2020-3-5')).toBe('2020-03-05')
  })

  it('normalizes compact YYYYMMDD', () => {
    expect(normalizeDateQuery('20200315')).toBe('2020-03-15')
  })
})

describe('parseDateQuery', () => {
  it('classifies a complete date as full', () => {
    expect(parseDateQuery('2020-03-15')).toEqual({ kind: 'full', iso: '2020-03-15' })
  })
})

describe('matchDateValue', () => {
  it('requires exact match for a full date', () => {
    expect(matchDateValue('2020-03-15', '2020-03-15')).toBe(true)
    expect(matchDateValue('2020-03-16', '2020-03-15')).toBe(false)
    expect(matchDateValue('2021-05-13', '2020-03-15')).toBe(false)
  })

  it('matches ISO partial and US format queries', () => {
    expect(matchDateValue('2020-03-15', '2020-03')).toBe(true)
    expect(matchDateValue('2020-03-15', '03/15/2020')).toBe(true)
    expect(matchDateValue('2020-03-15', '2020-3-15')).toBe(true)
    expect(matchDateValue('2020-03-15', '20200315')).toBe(true)
    expect(matchDateValue('2021-05-13', '2020-03')).toBe(false)
  })

  it('matches updatedAt independently of createdAt', () => {
    expect(matchDateValue('2021-06-20', '2021-06-20')).toBe(true)
    expect(matchDateValue('2021-06-20', '06/20/2021')).toBe(true)
    expect(matchDateValue('2020-03-15', '2021-06-20')).toBe(false)
  })
})

describe('rowMatchesSearch', () => {
  const row = {
    id: 42,
    name: 'Alice Adams',
    status: 'inactive',
    createdAt: '2020-03-15',
    updatedAt: '2021-06-20',
  }

  it('matches status "active" without matching "inactive"', () => {
    expect(rowMatchesSearch({ ...row, status: 'active' }, 'active', DEMO_SEARCH_FIELDS)).toBe(true)
    expect(rowMatchesSearch(row, 'active', DEMO_SEARCH_FIELDS)).toBe(false)
  })

  it('matches numeric id exactly', () => {
    expect(rowMatchesSearch(row, '42', DEMO_SEARCH_FIELDS)).toBe(true)
    expect(rowMatchesSearch(row, '4', DEMO_SEARCH_FIELDS)).toBe(false)
  })

  it('searches createdAt and updatedAt with flexible date input', () => {
    expect(rowMatchesSearch(row, '03/15/2020', DEMO_SEARCH_FIELDS)).toBe(true)
    expect(rowMatchesSearch(row, '06/20/2021', DEMO_SEARCH_FIELDS)).toBe(true)
    expect(rowMatchesSearch(row, '2020-3-15', DEMO_SEARCH_FIELDS)).toBe(true)
  })

  it('does not match a row when only the non-matching date column would qualify', () => {
    const onlyUpdatedMatches = {
      ...row,
      createdAt: '2021-05-13',
      updatedAt: '2020-03-15',
    }
    expect(rowMatchesSearch(onlyUpdatedMatches, '2020-03-15', DEMO_SEARCH_FIELDS)).toBe(true)
    expect(matchDateValue(onlyUpdatedMatches.createdAt, '2020-03-15')).toBe(false)
    expect(matchDateValue(onlyUpdatedMatches.updatedAt, '2020-03-15')).toBe(true)
  })

  it('excludes rows where neither date equals the full search date', () => {
    expect(
      rowMatchesSearch(
        { ...row, createdAt: '2021-05-13', updatedAt: '2021-05-13' },
        '2020-03-15',
        DEMO_SEARCH_FIELDS,
      ),
    ).toBe(false)
  })

  it('does not treat a year query as exact id match only', () => {
    const yearRow = { ...row, id: 2020, createdAt: '2020-01-01', updatedAt: '2020-12-31' }
    expect(rowMatchesSearch(yearRow, '2020', DEMO_SEARCH_FIELDS)).toBe(true)
    expect(
      rowMatchesSearch(
        { ...row, id: 99, createdAt: '2021-01-01', updatedAt: '2021-01-01' },
        '2020',
        DEMO_SEARCH_FIELDS,
      ),
    ).toBe(false)
  })
})

describe('matchesSearchQuery', () => {
  it('does not match inactive when searching active', () => {
    expect(matchesSearchQuery({ id: 1, name: 'x', status: 'inactive' }, 'active')).toBe(false)
  })

  it('matches exact numeric id', () => {
    expect(matchesSearchQuery({ id: 99, name: 'x' }, '99')).toBe(true)
    expect(matchesSearchQuery({ id: 999, name: 'x' }, '99')).toBe(false)
  })
})
