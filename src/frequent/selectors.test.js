import { getFrequentSpotsIds, getFrequentSpots } from './selectors'

describe('getFrequentSpotsIds', () => {
  it('returns IDs of all visited spots', () => {
    const state = {
      visits: {
        12: [1598126063],
        13: [1578918720, 1579048320]
      }
    }
    expect(getFrequentSpotsIds(state)).toEqual(['12', '13'])
  })
})

describe('getFrequentSpots', () => {
  it('returns all visited spots given 2 spots visited', () => {
    const state = {
      spots: [
        {
          _id: '12',
          name: 'Wiek',
          country: 'DE'
        },
        {
          _id: '13',
          name: 'Milada',
          country: 'CZ'
        }
      ],
      visits: {
        12: [1598126063],
        13: [1578918720, 1579048320]
      }
    }
    expect(getFrequentSpots(state)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        _id: '12',
        name: 'Wiek'
      }),
      expect.objectContaining({
        _id: '13',
        name: 'Milada'
      })
    ]))
  })
})