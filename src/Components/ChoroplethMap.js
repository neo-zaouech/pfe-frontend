import React, { useEffect, useState } from 'react'
import Datamap from 'datamaps/dist/datamaps.tun'
import d3 from 'd3'
import TunisiaJson from './Tunisia.topo.json'

const ChoroplethMap = ({ data, setGov }) => {
  const [gov, setTempGov] = useState('')
  useEffect(() => {
    let dataset = {}

    let onlyValues = data.map(function (obj) {
      return obj[1]
    })
    let minValue = Math.min.apply(null, onlyValues),
      maxValue = Math.max.apply(null, onlyValues)

    let paletteScale = d3.scale
      .linear()
      .domain([minValue, maxValue])
      .range(['#EFEFFF', '#02386F'])

    data.forEach(function (item) {
      let iso = item[0],
        value = item[1]
      dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) }
    })

    const map = new Datamap({
      element: document.getElementById('cloropleth_map'),
      scope: 'tunisia',
      geographyConfig: {
        popupOnHover: true,
        highlightOnHover: true,
        borderColor: '#444',
        highlightBorderWidth: 1,
        borderWidth: 0.5,
        dataJson: TunisiaJson,
        popupTemplate: function (geo, data) {
          if (!data) {
            return
          } else {
            setTempGov(geo.properties.name)
          }

          return [
            '<div className="hoverinfo">',
            '<strong>',
            geo.properties.name,
            '</strong>',

            '</div>',
          ].join('')
        },
      },
      fills: {
        HIGH: '#afafaf',
        LOW: '#123456',
        MEDIUM: 'blue',
        UNKNOWN: 'rgb(0,0,0)',
        defaultFill: '#eee',
      },
      data: dataset,
      setProjection: function (element) {
        var projection = d3.geo
          .mercator()
          .center([20, 35])
          .scale(2000)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2])

        var path = d3.geo.path().projection(projection)
        return { path: path, projection: projection }
      },
    })
  }, [])

  useEffect(() => {
    data.map((g) => {
      const element = document.getElementsByClassName(
        'datamaps-subunit ' + g[0]
      )
      element.length > 0 &&
        element[0].addEventListener('click', () => {
          setGov(g[0])
        })
    })
  }, [])
  return (
    <div
      id="cloropleth_map"
      style={{
        width: '200%',
        height: '500%',
        marginTop: '80px',
      }}
    ></div>
  )
}

export default ChoroplethMap
