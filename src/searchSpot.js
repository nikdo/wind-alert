import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

export default (spots, query) => spots
  .map(spot => ({
    ...spot,
    nameMatches: match(spot.name, query),
    regionMatches: match(spot.region, query)
  }))
  .filter(spot => spot.nameMatches.length || spot.regionMatches.length)
  .map(spotWithMatches => {
    const { nameMatches, regionMatches, ...spot } = spotWithMatches
    return {
      ...spot,
      nameFragments: parse(spot.name, nameMatches),
      regionFragments: spot.region ? parse(spot.region, regionMatches) : undefined
    }
  })
