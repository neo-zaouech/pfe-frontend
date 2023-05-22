import React from 'react'
import ChoroplethMap from '../ChoroplethMap'

const Map = ({ setGov }) => {
  var i = 1
  let data = [
    ['TO', i++],
    ['MN', i++],
    ['BJ', i++],
    ['BA', i++],
    ['BZ', i++],
    ['JE', i++],
    ['NB', i++],
    ['TU', i++],
    ['KF', i++],
    ['KS', i++],
    ['GB', i++],
    ['GF', i++],
    ['SZ', i++],
    ['SF', i++],
    ['SL', i++],
    ['MH', i++],
    ['MS', i++],
    ['KR', i++],
    ['SS', i++],
    ['ZA', i++],
    ['ME', i++],
    ['KB', i++],
    ['TA', i++],
  ]

  return (
    <div
      style={{
        position: 'absolute',
        top: '0px',
        left: '150px',
        height: '20vh',
        width: '40vw',
      }}
    >
      <ChoroplethMap data={data} setGov={setGov} />
    </div>
  )
}

export default Map
