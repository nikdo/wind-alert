import searchSpot, {
  nameMatchesFirst,
  startMatchesFirst
} from './searchSpot'

describe('nameMatchesFirst', () => {
  it('returns -1 if a has name matches while b has none', () => {
    expect(nameMatchesFirst(
      { nameMatches: ['match'] },
      { nameMatches: [] }
    )).toEqual(-1)
  })

  it('returns -1 if a has no name matches while b has', () => {
    expect(nameMatchesFirst(
      { nameMatches: [] },
      { nameMatches: ['match'] }
    )).toEqual(1)
  })

  it('returns 0 if both have name matches', () => {
    expect(nameMatchesFirst(
      { nameMatches: ['match'] },
      { nameMatches: ['match'] }
    )).toEqual(0)
  })

  it('returns 0 if both have no name matches', () => {
    expect(nameMatchesFirst(
      { nameMatches: [] },
      { nameMatches: [] }
    )).toEqual(0)
  })
})

describe('startMatchesFirst', () => {
  it('returns negative number if a matches start while b not', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [[0, 2]] },
      { nameMatches: [[2, 4]] }
    )).toBeLessThan(0)
  })

  it('returns positive number if a does not match start while be does', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [[2, 4]] },
      { nameMatches: [[0, 2]] }
    )).toBeGreaterThan(0)
  })

  it('returns 0 if a and b both match start', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [[0, 2]] },
      { nameMatches: [[0, 2]] }
    )).toEqual(0)
  })

  it('returns 0 if none matches start', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [[2, 4]] },
      { nameMatches: [[2, 4]] }
    )).toEqual(0)
  })

  it('returns negative number if a matches start while be has no matches', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [[0, 2]] },
      { nameMatches: [] }
    )).toBeLessThan(0)
  })

  it('returns positive number if a has no matches while matches start', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [] },
      { nameMatches: [[0, 2]] }
    )).toBeGreaterThan(0)
  })

  it('returns 0 if a has non-start match and b has no matches', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [[2, 4]] },
      { nameMatches: [] }
    )).toEqual(0)
  })

  it('returns 0 if a has no matches and b has non-start match', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [] },
      { nameMatches: [[2, 4]] }
    )).toEqual(0)
  })

  it('returns 0 if a and b have no matches', () => {
    expect(startMatchesFirst(spot => spot.nameMatches)(
      { nameMatches: [] },
      { nameMatches: [] }
    )).toEqual(0)
  })
})

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
      ' f'
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

  it('sorts first word matches in name before other word matches in name', () => {
    expect(searchSpot(
      [{ name: 'Ak Bar' }, { name: 'Barbar' }, { name: 'Foo Bar' }],
      'ba'
    ).map(spot => spot.name))
      .toEqual(['Barbar', 'Ak Bar', 'Foo Bar'])
  })

  it('sorts first word matches in region before other word matches in region', () => {
    expect(searchSpot(
      [{ region: 'Ak Bar' }, { region: 'Barbar' }, { region: 'Foo Bar' }],
      'ba'
    ).map(spot => spot.region))
      .toEqual(['Barbar', 'Ak Bar', 'Foo Bar'])
  })

  it('does not reorder non-first word matches', () => {
    expect(searchSpot(
      [{ name: 'Ak Boo Bar' }, { name: 'Barbar' }, { name: 'Foo Bar' }],
      'ba'
    ).map(spot => spot.name))
      .toEqual(['Barbar', 'Ak Boo Bar', 'Foo Bar'])
  })

  it('sorts match types correctly', () => {
    expect(
      searchSpot([
        { name: 'Deadly Spot', region: 'Los Nostros' },
        { name: 'Merkur', region: 'Nové Mlýny' },
        { name: 'Ostrožská Nová Ves' },
        { name: 'Noli' }
      ],
      'no'
      ).map(spot => spot.name)
    ).toEqual([
      // 1. first-word match in name
      'Noli',
      // 2. second-word match in name
      'Ostrožská Nová Ves',
      // 3. first-word match in region
      'Merkur',
      // 4. second-word match in region
      'Deadly Spot'
    ])
  })
})
