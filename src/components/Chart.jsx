import React, { Component } from 'react'
import transform from './transformations/transform'
import windChart from '../charts/windChart'
import styles from './Chart.module.css'

export default class Chart extends Component {
  constructor (props) {
    super(props)
    this.canvasNode = React.createRef()
    this.state = { visualisations: null }
  }

  removeChart () {
    const chart = this.canvasNode.current
    while (chart.hasChildNodes()) {
      chart.removeChild(chart.lastChild)
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.spotId !== this.props.spotId
  }

  static getDerivedStateFromProps (props) {
    return { visualisations: transform(props.forecast) }
  }

  componentDidMount () {
    windChart(this.canvasNode.current, this.props.forecast, this.state.visualisations)
  }

  componentDidUpdate () {
    this.removeChart()
    windChart(this.canvasNode.current, this.props.forecast, this.state.visualisations)
  }

  render () {
    const { dimensions } = this.state.visualisations
    const margin = { top: 25, right: 80, bottom: 24, left: 34 }
    return (
      <svg
        className={styles.chart}
        width={dimensions.w + margin.left + margin.right}
        height={dimensions.h + margin.top + margin.bottom}
        style={{ marginLeft: -margin.left }}
      >
        <g
          ref={this.canvasNode}
          width={dimensions.w}
          height={dimensions.h}
          transform={`translate(${margin.left}, ${margin.top})`}
        />
      </svg>
    )
  }
}
