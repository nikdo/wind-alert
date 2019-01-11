import React, { Component } from 'react'
import moment from 'moment-timezone'
import Selector from './components/Selector'
import Chart from './components/Chart'
import Spinner from './components/Spinner'
import './App.css'

const deserialize = spot => ({
  ...spot,
  forecast: spot.forecast.map(frame => ({
    ...frame,
    time: moment.unix(frame.time).tz(spot.timezone),
    windSpeed: Math.round(frame.windSpeed * 10) / 10,
    windGust: Math.round(frame.windGust * 10) / 10
  }))
})

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      spot: null,
      selected: null,
      options: []
    }
    this.handleSpotChange = this.handleSpotChange.bind(this)
  }

  fetchData () {
    fetch(process.env.REACT_APP_API_URL + '/spots')
      .then(res => res.json())
      .then(options => {
        this.fetchSpot(options[0]._id)
        this.setState({
          options,
          selected: options[0]._id
        })
      })
  }

  fetchSpot (id) {
    fetch(process.env.REACT_APP_API_URL + `/spots/${id}`)
      .then(res => res.json())
      .then(deserialize)
      .then(spot => {
        document.title = spot.name
        this.setState({ spot: spot })
      })
  }

  componentDidMount () {
    this.fetchData()
  }

  handleSpotChange (id) {
    this.fetchSpot(id)
    this.setState({ selected: id })
  }

  render () {
    return <main>
      {this.state.spot && this.state.options.length
        ? <div>
          <Selector
            value={this.state.selected}
            spots={this.state.options}
            onChange={this.handleSpotChange}
          />
          <Chart spotId={this.state.spot._id} forecast={this.state.spot.forecast} />
          <a href='https://darksky.net/poweredby/'>Powered by Dark Sky</a>
        </div>
        : <Spinner />
      }
    </main>
  }
}
