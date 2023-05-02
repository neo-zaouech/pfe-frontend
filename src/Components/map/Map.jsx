import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ChoroplethMap from '../ChoroplethMap'

const Map = ({ gov, setGov }) => {
  const state = useSelector((state) => state)
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
        top: '150px',
        left: '200px',
        height: '10vh',
        width: '15vw',
      }}
    >
      <ChoroplethMap data={data} setGov={setGov} />
    </div>
  )
}

export default Map
