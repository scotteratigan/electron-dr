import React from 'react'

const bodyPositionContainerStyle = { width: 25, height: 25, background: "black", color: "white"}

// standing, sitting, kneeling, prone
export default function BodyPosition({ bodyPosition }) {
  switch (bodyPosition) {
    case "standing":
      return Standing()
    case "kneeling":
      return Kneeling()
    case "sitting":
      return Sitting()
    case "prone":
      return Prone()
    default:
      return <div></div>
  }
}

function Standing() {
  return (
    <div style={bodyPositionContainerStyle}>
      <svg viewBox="0 0 53.355 53.355" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26.677" cy="4.383" r="4.383"/>
        <path d="M40.201,28.096c-1.236-13.887-7.854-16.657-7.854-16.657s-6.396-3.845-13.129,1.052
          c-4.365,3.973-5.373,10.038-6.063,15.896c-0.349,2.977,4.307,2.941,4.653,0c0.412-3.496,1-7.008,2.735-9.999l-0.008,3.375
          l-0.032,16.219v12.867c0,1.383,1.014,2.506,2.438,2.506c1.423,0,2.578-1.123,2.578-2.506V32.457h2.278c0,4.309,0,14.144,0,18.451
          c0,3,4.652,3,4.652,0c0-4.309,0-8.619,0-12.927l0.197-16.251c0.002-1.551,0.004-2.937,0.004-3.901
          c1.859,3.046,2.473,6.664,2.896,10.265C35.895,31.037,40.55,31.073,40.201,28.096z"/>
      </svg>
    </div>
  )
}

function Sitting() {
  return (
  <div style={bodyPositionContainerStyle}>
      <svg viewBox="0 0 199.216 199.216" xmlns="http://www.w3.org/2000/svg">
        <path d="M128.005,40.172c11.24,0.336,20.621-8.385,20.951-19.476c0.33-11.088-8.512-20.351-19.752-20.687
          c-11.234-0.335-20.617,8.385-20.947,19.471C107.925,30.573,116.771,39.836,128.005,40.172z"/>
        <path d="M150.579,56.893c0.274-2.674-0.599-5.338-2.397-7.334s-4.361-3.146-7.051-3.146H115.57c-4.153,0-7.629,3.155-8.028,7.289
          l-6.431,66.48H63.127c-3.86,0-7.562,1.535-10.289,4.267c-2.727,2.732-4.257,6.437-4.251,10.297l0.081,53.626
          c0.01,6.008,4.882,10.845,10.887,10.845c0.005,0,0.013,0,0.019,0c6.013,0,10.879-4.886,10.871-10.899l-0.065-43.052
          c-0.001-0.888,0.351-1.74,0.979-2.369c0.627-0.628,1.479-0.98,2.366-0.98h58.345c6.013,0,10.254-4.589,10.889-10.882
          C143,130.616,148.259,79.451,150.579,56.893z"/>
      </svg>
    </div>
  )
}

function Kneeling() {
  return (
  <div style={bodyPositionContainerStyle}>
    <svg viewBox="0 0 78.732 78.732" xmlns="http://www.w3.org/2000/svg">
      <path d="M58.134,48.752l-10.83-23.024c-0.017-0.036-0.042-0.067-0.06-0.102c-0.392-1.202-1.509-2.078-2.84-2.078H38.02
        c-1.654,0-3,1.346-3,3v30.628c0,1.527,1.15,2.776,2.627,2.962l-0.05,7.409c-0.006,0.886-0.732,1.607-1.618,1.607H23.912
        c-1.985,0-3.6,1.615-3.6,3.6v2.409c0,1.969,1.601,3.57,3.569,3.57L43.816,78.5c1.979-0.023,3.588-1.651,3.588-3.63V57.175v-0.984
        V43.882l4.029,8.032c0.513,1.022,1.592,1.683,2.748,1.683c0.446,0,0.875-0.095,1.278-0.283l1.231-0.575
        c0.725-0.338,1.275-0.94,1.548-1.694C58.512,50.29,58.475,49.476,58.134,48.752z M23.882,77.729L23.882,77.729v0.003V77.729z"/>
      <path d="M41.212,20.338c5.607,0,10.168-4.562,10.168-10.169S46.819,0,41.212,0c-5.607,0-10.169,4.562-10.169,10.169
        S35.605,20.338,41.212,20.338z"/>
    </svg>
    </div>
  )
}

function Prone() {
  return (
    <div style={bodyPositionContainerStyle}>
      <svg viewBox="0 0 125.417 125.417" xmlns="http://www.w3.org/2000/svg">
        <circle cx="112.82" cy="78.398" r="12.596"/>
        <path d="M99.414,75.356c-0.219-0.858-0.542-1.729-0.954-2.568l-0.079-33.486c-0.007-2.697-2.193-4.879-4.89-4.879
          c-0.005,0-0.009,0-0.013,0c-2.701,0.007-4.886,2.201-4.879,4.901L88.664,66.7l-26.802,0.23c-3.908,0.033-6.824,2.576-8.388,5.871
          L5.777,72.817C2.586,72.819-0.001,75.407,0,78.599c0.001,3.192,2.588,5.778,5.779,5.778H5.78l47.784-0.017
          c1.566,3.156,4.462,5.721,8.5,5.686l27.803-0.238c5.162-0.046,8.583-4.604,9.578-8.822c0,0,0.387-1.329,0.343-2.74
          c-0.041-1.35-0.368-2.852-0.368-2.852L99.414,75.356z"/>
      </svg>
    </div>
    )
}