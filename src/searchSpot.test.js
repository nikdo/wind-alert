import searchSpot from './searchSpot'

describe('searchSpot', () => {
  it('returns spots with names starting with query', () => {
    expect(searchSpot(
      [{ name: 'Foo' }, { name: 'Far' }, { name: 'Boo' }],
      'F'
    )).toEqual([
      expect.objectContaining({ name: 'Foo' }),
      expect.objectContaining({ name: 'Far' })
    ])
  })

  it('returns empty array when no name starts with query', () => {
    expect(searchSpot(
      [{ name: 'Foo' }, { name: 'Boo' }],
      'X'
    )).toEqual([])
  })

  it('ignores casing', () => {
    expect(searchSpot(
      [{ name: 'Foo' }, { name: 'Boo' }],
      'f'
    )).toEqual([
      expect.objectContaining({ name: 'Foo' })
    ])
  })

  it('trims query whitespace', () => {
    expect(searchSpot(
      [{ name: 'Foo' }, { name: 'Boo' }],
      ' f '
    )).toEqual([
      expect.objectContaining({ name: 'Foo' })
    ])
  })

  it('ignores diacritics in query', () => {
    expect(searchSpot(
      [{ name: 'coo' }, { name: 'boo' }],
      'čó'
    )).toEqual([
      expect.objectContaining({ name: 'coo' })
    ])
  })

  it('ignores diacritics in spot name', () => {
    expect(searchSpot(
      [{ name: 'čóó' }, { name: 'boo' }],
      'co'
    )).toEqual([
      expect.objectContaining({ name: 'čóó' })
    ])
  })

  it('returns both names and regions that match query', () => {
    expect(searchSpot(
      [{ name: 'Foo' }, { name: 'Bar', region: 'Far' }, { name: 'Boo' }],
      'f'
    )).toEqual([
      expect.objectContaining({ name: 'Foo' }),
      expect.objectContaining({ region: 'Far' })
    ])
  })

  it('does not highlight region if there is a name match', () => {
    expect(searchSpot(
      [{ name: 'Foo', region: 'Fee' }],
      'f'
    )).toEqual(
      [expect.objectContaining({
        regionFragments: [{ text: 'Fee', highlight: false }]
      })]
    )
  })

  it('sorts name matches before region matches', () => {
    expect(searchSpot(
      [{ name: 'Foo' }, { name: 'Boo', region: 'Fax' }, { name: 'Far' }],
      'f'
    )).toEqual([
      expect.objectContaining({ name: 'Foo' }),
      expect.objectContaining({ name: 'Far' }),
      expect.objectContaining({ region: 'Fax' })
    ])
  })
})
