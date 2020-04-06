import React from 'react'

const indicatorContainerStyle = { width: 18, height: 18, textAlign: "center"}
// https://www.svgrepo.com/vectors/

export default function Indicators({ bleeding, dead, hidden, invisible, joined, stunned }) {
  return (
    <>
      {bleeding && Bleeding()}
      {dead && Dead()}
      {hidden && Hidden()}
      {invisible && Invisible()}
      {joined && Joined()}
      {stunned && Stunned()}
    </>
  )
}

function Bleeding() {
  return (
    <div style={indicatorContainerStyle}>
      <svg viewBox="0 0 377.547 377.547" xmlns="http://www.w3.org/2000/svg">
        <path d="M222.703,149.877c0-7.167-1.073-14.074-3.014-20.614c-1.799-12.788-5.854-25.629-11.909-37.397
          C178.856,35.726,136.323,0,136.323,0s-0.605,30.294-23.91,57.306c-43.178,50.017-34.504,100.4-34.504,100.4l0.008,0.008
          c3.909,36.417,34.723,64.786,72.176,64.786C190.191,222.493,222.703,189.988,222.703,149.877z M113.829,97.44
          c-0.899,0.571-21.035,13.868-18.264,57.252c0.13,2.158-1.499,4.025-3.669,4.167c-0.084,0-0.164,0.006-0.249,0.006
          c-2.06,0-3.777-1.602-3.911-3.671c-3.094-48.518,20.961-63.812,21.989-64.438c1.839-1.146,4.262-0.551,5.4,1.304
          C116.242,93.898,115.67,96.302,113.829,97.44z"/>
        <path d="M300.351,244.144c0-4.264-0.638-8.355-1.795-12.25c-1.074-7.606-3.475-15.232-7.078-22.226
          c-17.188-33.364-42.462-54.593-42.462-54.593s-0.361,18.001-14.223,34.055c-25.659,29.724-20.498,59.659-20.498,59.659v0.016
          c2.32,21.636,20.639,38.491,42.892,38.491C281.031,287.292,300.351,267.973,300.351,244.144z M235.651,212.979
          c-0.533,0.34-12.495,8.243-10.852,34.022c0.076,1.291-0.898,2.4-2.188,2.477c-0.044,0-0.1,0-0.145,0
          c-1.226,0-2.248-0.949-2.332-2.184c-1.831-28.825,12.467-37.919,13.072-38.291c1.098-0.678,2.537-0.333,3.214,0.766
          C237.078,210.871,236.741,212.305,235.651,212.979z"/>
        <path d="M237.984,339.405c-0.738-5.226-2.393-10.471-4.878-15.284c-11.829-22.971-29.222-37.581-29.222-37.581
          s-0.244,12.395-9.782,23.443c-17.665,20.453-14.114,41.06-14.114,41.06v0.008c1.601,14.896,14.211,26.497,29.522,26.497
          c16.398,0,29.699-13.301,29.699-29.69C239.217,344.911,238.773,342.09,237.984,339.405z M194.691,326.397
          c-0.368,0.236-8.605,5.675-7.474,23.419c0.052,0.882-0.613,1.644-1.499,1.703c-0.032,0-0.074,0-0.104,0
          c-0.848,0-1.545-0.661-1.603-1.511c-1.26-19.832,8.576-26.096,9.001-26.349c0.753-0.477,1.739-0.229,2.2,0.521
          C195.673,324.946,195.437,325.928,194.691,326.397z"/>
      </svg>
    </div>
  )
}

function Dead() {
  return (
    <div style={indicatorContainerStyle}>
      <svg viewBox="0 0 588.385 588.385" xmlns="http://www.w3.org/2000/svg">
        <path d="M444.685,372.061c-46.817-16.524-78.642-64.872-55.691-114.444c20.502-43.758,77.112-29.07,112.608-23.868
          c24.174,3.672,41.004-6.12,40.697-31.212c-1.225-77.112-133.722-164.322-200.735-122.094
          c-16.219,10.098-27.54,31.212-36.414,47.124c-21.421,39.168-51.103,6.12-68.545-13.77C205.393,78.3,174.181,37.908,129.811,18.019
          C73.812-6.768,49.333,56.574,49.944,100.026c1.224,60.588,27.234,135.558,64.26,186.966
          C-97.854,196.11,41.376,541.584,89.112,528.427c6.12-1.836,11.934-9.181,14.382-14.688c17.442-42.228,23.562-101.592,87.516-86.904
          c55.08,12.853,101.898,81.396,146.269,114.444c72.828,54.162,179.928,44.982,235.312-28.458
          C635.322,429.895,494.257,389.809,444.685,372.061z M561.576,506.395c-37.025,67.932-137.699,67.014-197.063,37.026
          c-44.676-22.645-78.948-64.872-117.504-96.084c-61.812-50.49-124.848-43.759-146.574,37.943
          c-20.196,75.889-64.872-42.534-74.052-69.462c-8.262-23.868-12.546-48.96-13.464-73.746c-3.06-70.38,58.446-63.342,107.406-40.086
          c2.142,0.918,3.978,0.612,5.508-0.306c2.448,1.836,6.12-1.225,4.284-3.979c-0.306-0.611-0.918-1.529-1.224-2.142
          s-0.612-1.53-1.224-2.142C90.031,230.076,38.011,118.692,72.283,48.006C119.712-49.302,235.38,163.98,279.75,167.652
          c30.907,2.448,44.065-49.878,59.976-68.544c32.437-38.556,89.353-7.344,120.87,12.24c22.032,13.77,39.168,33.66,53.55,54.774
          c20.502,29.682,4.283,59.976-33.048,51.714c-78.029-16.83-129.438,38.862-102.815,113.832
          C405.823,409.087,622.164,394.704,561.576,506.395z"/>
        <path d="M85.44,79.524c-0.306-0.306-0.918-0.306-1.224,0c0.306-1.836-1.836-3.366-3.366-1.836
          c-10.404,12.24-9.486,28.764,1.224,40.392c1.224,1.224,3.366,1.224,4.59,0c5.202-5.508,8.874-11.628,9.18-19.584
          C96.15,91.458,92.172,82.584,85.44,79.524z M84.522,110.736c-6.426-8.568-7.038-18.666-1.53-28.152
          c1.836,4.59,4.896,8.262,6.12,13.158C90.336,100.944,87.889,106.453,84.522,110.736z"/>
        <path d="M128.281,49.537c-11.628-6.732-26.928-2.448-29.682,11.628c-0.612,3.366,3.978,5.814,5.814,2.448
          c4.896-9.792,11.628-12.546,21.726-7.038c8.874,4.59,15.3,14.382,14.076,24.48c-12.546,0.918-23.562-4.284-29.988-15.606
          c-1.53-2.448-5.202-0.306-3.978,2.448c7.344,14.076,20.808,20.502,36.414,18.972c1.224,0,2.448-0.918,2.754-2.142
          C149.088,70.344,140.521,56.574,128.281,49.537z"/>
        <path d="M210.289,137.052c-15.3-33.66-67.932-57.834-99.144-31.212c-1.224,0.918-1.53,2.448-1.53,3.672
          c-20.196,10.098-21.726,33.048-10.098,53.55c13.77,24.174,43.758,44.37,72.216,42.84
          C203.25,204.373,222.834,164.287,210.289,137.052z M164.389,195.192c-35.802-1.836-84.456-52.326-52.02-81.396
          c1.53,0.918,3.366,1.224,5.202,0c27.54-19.584,67.32-2.754,82.62,24.786C213.96,163.98,191.929,196.723,164.389,195.192z"/>
      </svg>
    </div>
  )
}

function Hidden() {
  return (
    <div style={indicatorContainerStyle}>
      <svg viewBox="0 0 461.436 461.436" xmlns="http://www.w3.org/2000/svg">
        <path d="M460.403,307.005c-3.187-11.001-13.36-19.001-29.068-23.086c14.28-34.816,13.186-63.461-3.423-74.489
          c-3.456-2.295-8.516-4.418-15.419-4.448c7.685-27.252,4.443-48.199-9.367-57.368c-10.055-6.675-23.911-5.722-39.428,2.353
          c2.033-24.381-4.198-41.98-17.781-48.564c-13.305-6.45-30.675-0.724-48.265,15.349c-3.839-19.897-12.831-32.72-25.766-36.066
          c-13.198-3.417-27.831,3.982-41.168,20.472c-13.334-16.489-27.965-23.888-41.168-20.472c-12.936,3.347-21.928,16.169-25.766,36.066
          c-17.59-16.072-34.959-21.797-48.265-15.348c-13.583,6.583-19.815,24.182-17.782,48.563c-15.517-8.076-29.373-9.03-39.426-2.353
          c-13.812,9.169-17.052,30.119-9.368,57.368c-6.902,0.03-11.963,2.153-15.418,4.448c-16.61,11.028-17.705,39.673-3.424,74.49
          c-15.708,4.085-25.881,12.084-29.069,23.085c-4.84,16.704,7.477,35.787,33.792,52.357c23.07,14.527,50.197,22.206,78.448,22.206
          h234.89c28.252,0,55.379-7.679,78.449-22.206C452.927,342.791,465.243,323.708,460.403,307.005z M417.554,344.976
          c-20.354,12.817-44.349,19.591-69.391,19.591h-234.89c-25.041,0-49.036-6.774-69.39-19.591
          c-18.288-11.516-28.946-24.874-26.522-33.24c1.828-6.308,11.528-11.19,25.948-13.059c2.703-0.351,5.075-1.977,6.376-4.372
          c1.302-2.396,1.375-5.27,0.198-7.729c-15.953-33.317-15.49-57.317-6.954-62.984c1.767-1.173,3.912-1.621,6.158-1.621
          c3.268,0,6.748,0.948,9.585,1.99c3.135,1.149,6.654,0.36,8.995-2.023s3.068-5.916,1.86-9.03
          c-11.091-28.595-8.715-46.55-1.813-51.132c6.702-4.453,20.889,0.444,36.135,12.48c2.826,2.231,6.751,2.44,9.8,0.519
          c3.047-1.921,4.552-5.553,3.757-9.066c-5.561-24.583-3.287-44.736,5.527-49.008c8.551-4.142,25.319,6.017,40.795,24.694
          c2.256,2.722,5.961,3.76,9.299,2.618c3.343-1.145,5.629-4.239,5.742-7.77c0.678-21.235,6.722-36.948,15.037-39.1
          c7.707-1.99,19.389,7.093,29.774,23.146c1.566,2.421,4.253,3.883,7.137,3.883s5.57-1.462,7.137-3.883
          c10.385-16.052,22.069-25.139,29.773-23.146c8.315,2.151,14.359,17.864,15.038,39.1c0.113,3.531,2.399,6.625,5.742,7.77
          c3.341,1.143,7.045,0.103,9.299-2.619c15.478-18.679,32.258-28.835,40.794-24.693c8.815,4.272,11.088,24.426,5.526,49.008
          c-0.794,3.513,0.711,7.145,3.758,9.066c3.047,1.92,6.974,1.713,9.8-0.519c15.245-12.035,29.429-16.934,36.137-12.479
          c6.9,4.582,9.277,22.537-1.813,51.132c-1.208,3.114-0.479,6.647,1.86,9.03c2.34,2.383,5.858,3.173,8.995,2.023
          c4.787-1.758,11.406-3.25,15.743-0.369c8.535,5.667,8.998,29.667-6.954,62.985c-1.177,2.458-1.104,5.333,0.198,7.728
          c1.302,2.396,3.673,4.021,6.376,4.372c14.42,1.869,24.119,6.751,25.947,13.059C446.499,320.102,435.841,333.46,417.554,344.976z"/>
        <path d="M149.419,284.856c-14.611,0-26.499,11.887-26.499,26.499s11.888,26.499,26.499,26.499s26.499-11.887,26.499-26.499
          S164.03,284.856,149.419,284.856z M149.419,320.854c-5.237,0-9.499-4.261-9.499-9.499s4.262-9.499,9.499-9.499
          s9.499,4.261,9.499,9.499S154.656,320.854,149.419,320.854z"/>
        <path d="M305.414,284.856c-14.611,0-26.499,11.887-26.499,26.499s11.888,26.499,26.499,26.499c14.612,0,26.5-11.887,26.5-26.499
          S320.026,284.856,305.414,284.856z M305.414,320.854c-5.237,0-9.499-4.261-9.499-9.499s4.262-9.499,9.499-9.499
          c5.238,0,9.5,4.261,9.5,9.499S310.652,320.854,305.414,320.854z"/>
        <path d="M230.719,154.787c-14.611,0-26.499,11.887-26.499,26.499s11.888,26.499,26.499,26.499s26.499-11.887,26.499-26.499
          S245.33,154.787,230.719,154.787z M230.719,190.785c-5.237,0-9.499-4.261-9.499-9.499s4.262-9.499,9.499-9.499
          s9.499,4.261,9.499,9.499S235.956,190.785,230.719,190.785z"/>
        <path d="M227.417,250.26c-14.611,0-26.499,11.887-26.499,26.499s11.888,26.499,26.499,26.499s26.499-11.887,26.499-26.499
          S242.028,250.26,227.417,250.26z M227.417,286.258c-5.237,0-9.499-4.261-9.499-9.499s4.262-9.499,9.499-9.499
          s9.499,4.261,9.499,9.499S232.654,286.258,227.417,286.258z"/>
        <path d="M157.504,231.7c0-14.612-11.888-26.499-26.499-26.499s-26.499,11.887-26.499,26.499s11.888,26.5,26.499,26.5
          S157.504,246.311,157.504,231.7z M121.506,231.7c0-5.238,4.262-9.499,9.499-9.499c5.237,0,9.499,4.261,9.499,9.499
          c0,5.238-4.262,9.5-9.499,9.5C125.767,241.199,121.506,236.938,121.506,231.7z"/>
        <path d="M330.432,205.201c-14.612,0-26.5,11.887-26.5,26.499s11.888,26.5,26.5,26.5c14.611,0,26.499-11.888,26.499-26.5
          S345.044,205.201,330.432,205.201z M330.432,241.199c-5.238,0-9.5-4.261-9.5-9.5c0-5.238,4.262-9.499,9.5-9.499
          c5.237,0,9.499,4.261,9.499,9.499C339.931,236.938,335.67,241.199,330.432,241.199z"/>
      </svg>
    </div>
  )
}

function Invisible() {
  return (
    <div style={indicatorContainerStyle}>
      <svg viewBox="0 0 98.48 98.481" xmlns="http://www.w3.org/2000/svg">
        <path d="M69.322,44.716L49.715,64.323C60.438,64.072,69.071,55.438,69.322,44.716z"/>
        <path d="M97.204,45.789c-0.449-0.529-6.245-7.23-15.402-13.554l-6.2,6.2c5.99,3.954,10.559,8.275,13.011,10.806
          C83.235,54.795,67.7,68.969,49.241,68.969c-1.334,0-2.651-0.082-3.952-0.222l-7.439,7.438c3.639,0.91,7.449,1.451,11.391,1.451
          c26.426,0,47.098-23.927,47.964-24.946C98.906,50.692,98.906,47.79,97.204,45.789z"/>
        <path d="M90.651,15.901c0-0.266-0.104-0.52-0.293-0.707l-7.071-7.07c-0.391-0.391-1.022-0.391-1.414,0L66.045,23.952
          c-5.202-1.893-10.855-3.108-16.804-3.108c-26.427,0-47.098,23.926-47.965,24.946c-1.701,2-1.701,4.902,0.001,6.903
          c0.517,0.606,8.083,9.354,19.707,16.319l-12.86,12.86c-0.188,0.188-0.293,0.441-0.293,0.707c0,0.267,0.105,0.521,0.293,0.707
          l7.071,7.07c0.195,0.194,0.451,0.293,0.707,0.293c0.256,0,0.512-0.099,0.707-0.293l73.75-73.75
          C90.546,16.421,90.651,16.167,90.651,15.901z M9.869,49.241C13.5,45.49,21.767,37.812,32.436,33.22
          c-2.081,3.166-3.301,6.949-3.301,11.021c0,4.665,1.601,8.945,4.27,12.352l-6.124,6.123C19.129,58.196,12.89,52.361,9.869,49.241z"
          />
      </svg>
    </div>
  )
}

function Joined() {
  return (
    <div style={indicatorContainerStyle}>
      <svg viewBox="0 0 473.081 473.081" xmlns="http://www.w3.org/2000/svg">
        <path d="M471.176,162.893c-2.537-2.539-6.653-2.539-9.192,0l-40.487,40.488c-1.054,1.054-1.713,2.438-1.868,3.921
          c-3.223,30.84-17.072,59.9-38.999,81.826l-9.621,9.621l-69.908-69.908c4.422,1.044,8.75,1.572,12.953,1.572
          c6.165,0,12.065-1.127,17.607-3.395c3.323-1.359,4.914-5.155,3.555-8.477c-1.359-3.324-5.156-4.913-8.477-3.555
          c-26.768,10.951-57.628-18.195-61.515-22.022l-18.575-18.575c2.306-9.78,0.315-20.276-5.615-28.803
          c-6.704-9.638-17.362-15.165-29.287-15.165l-44.991,0.322c-0.04,0-0.08,0-0.119,0c-4.307,0-8.357-1.669-11.416-4.707
          c-3.087-3.066-4.787-7.151-4.786-11.504v-0.677c0.002-8.733,6.84-15.844,15.567-16.188l81.933-3.228
          c29.569-1.164,59.042,7.816,82.946,25.285c2.588,1.89,6.166,1.614,8.431-0.652l43.032-43.032c2.539-2.538,2.539-6.654,0.001-9.192
          c-2.539-2.539-6.654-2.539-9.193,0l-39.173,39.174c-25.398-17.079-55.919-25.778-86.556-24.573l-81.933,3.228
          c-0.193,0.008-0.382,0.025-0.573,0.037l-31.087-31.086c-2.538-2.539-6.654-2.539-9.192,0c-2.539,2.538-2.539,6.654,0,9.192
          l26.352,26.352c-8.178,5.174-13.552,14.289-13.555,24.682v0.677c-0.002,7.842,3.062,15.204,8.625,20.73
          c5.564,5.526,12.941,8.539,20.789,8.482l44.944-0.322c10.353,0,16.077,6.007,18.567,9.588c1.897,2.727,3.168,5.757,3.787,8.879
          l-2.228-2.228c-2.538-2.539-6.654-2.539-9.192,0c-2.539,2.538-2.539,6.654,0,9.192l146.666,146.666
          c6.334,6.333,6.334,16.639,0,22.972c-6.33,6.331-16.63,6.332-22.962,0.008l-93.42-93.419c-2.537-2.539-6.654-2.539-9.191,0
          c-2.539,2.538-2.539,6.654,0,9.192l100.622,100.623c6.334,6.333,6.334,16.639,0,22.972c-3.067,3.068-7.146,4.758-11.486,4.758
          c-4.339,0-8.418-1.69-11.485-4.758l-95.387-95.387c-2.539-2.538-6.654-2.538-9.192,0s-2.539,6.654,0,9.192l78.161,78.162
          c6.328,6.334,6.326,16.634-0.005,22.965c-6.335,6.334-16.64,6.333-22.973,0l-84.888-84.888c-2.538-2.539-6.654-2.539-9.192,0
          c-2.539,2.538-2.539,6.654,0,9.192l62.967,62.967c0,0,0.001,0.001,0.001,0.001c6.334,6.333,6.334,16.638,0,22.972
          c-6.332,6.333-16.638,6.333-22.971,0L104.073,289.128c-21.926-21.926-35.776-50.986-38.998-81.826
          c-0.155-1.483-0.814-2.867-1.869-3.921l-52.11-52.111c-2.538-2.539-6.654-2.539-9.192,0c-2.539,2.538-2.539,6.654,0,9.192
          l50.502,50.502c3.968,32.934,18.996,63.876,42.475,87.355l9.586,9.586c-3.569,4.941-5.5,10.856-5.5,17.071
          c0,7.811,3.042,15.155,8.565,20.678c5.701,5.701,13.189,8.552,20.678,8.552c0.737,0,1.473-0.036,2.208-0.091
          c-0.251,1.552-0.386,3.134-0.386,4.737c0,7.811,3.042,15.155,8.565,20.678c5.701,5.701,13.189,8.552,20.678,8.552
          c1.457,0,2.914-0.111,4.358-0.327c-1.325,8.865,1.414,18.226,8.224,25.036c5.523,5.523,12.867,8.565,20.678,8.565
          c6.962,0,13.549-2.422,18.811-6.859c5.294,4.191,11.71,6.293,18.131,6.293c7.488,0,14.978-2.851,20.679-8.552
          c4.247-4.247,6.909-9.487,7.992-14.979l4.733,4.733c5.702,5.702,13.189,8.552,20.679,8.552c7.488,0,14.979-2.851,20.68-8.552
          c4.247-4.247,6.909-9.486,7.992-14.978l0.045,0.045c5.523,5.523,12.867,8.565,20.679,8.565c7.813,0,15.156-3.042,20.68-8.565
          c8.349-8.349,10.576-20.53,6.698-30.932c6.66-0.55,13.168-3.36,18.252-8.445c10.858-10.858,11.368-28.195,1.546-39.672l9.69-9.691
          c23.479-23.479,38.507-54.422,42.476-87.356l38.879-38.879C473.715,169.546,473.715,165.431,471.176,162.893z M116.725,336.462
          c-3.068-3.068-4.758-7.147-4.758-11.486c0-2.717,0.663-5.331,1.911-7.66l21.992,21.992c-2.328,1.248-4.943,1.911-7.66,1.911
          C123.872,341.221,119.793,339.531,116.725,336.462z M147.79,370.339c-3.068-3.068-4.758-7.147-4.758-11.486
          c0-3.413,1.059-6.656,2.999-9.382l22.624,22.624C162.318,376.587,153.464,376.012,147.79,370.339z M181.05,403.599
          c-5.674-5.674-6.248-14.527-1.756-20.865l22.624,22.624c-2.726,1.939-5.97,2.999-9.383,2.999
          C188.197,408.357,184.118,406.667,181.05,403.599z"/>
      </svg>
    </div>
  )
}

function Stunned() {
  return (
    <div style={indicatorContainerStyle}>
      <svg viewBox="0 0 59.979 59.979" xmlns="http://www.w3.org/2000/svg">
        <path d="M27.649,27.979c0-0.553-0.448-1-1-1s-1,0.447-1,1c0,3.869-1.776,6-5,6c-2.596,0-5.369-1.132-5.369-4.307
          c0-2.224,1.809-4.032,4.032-4.032c1.641,0,2.975,1.335,2.975,2.976c0,1.18-0.96,2.14-2.141,2.14c-0.816,0-1.48-0.664-1.48-1.48
          c0-0.529,0.43-0.96,0.959-0.96c0.552,0,1-0.447,1-1s-0.448-1-1-1c-1.632,0-2.959,1.328-2.959,2.96c0,1.919,1.562,3.48,3.48,3.48
          c2.283,0,4.141-1.857,4.141-4.14c0-2.743-2.232-4.976-4.975-4.976c-3.326,0-6.032,2.706-6.032,6.032
          c0,3.772,2.961,6.307,7.369,6.307C24.967,35.979,27.649,32.913,27.649,27.979z"/>
        <path d="M38.28,21.979c-4.318,0-7,3.065-7,8c0,0.553,0.448,1,1,1c0.552,0,1-0.447,1-1c0-3.869,1.776-6,5-6
          c2.596,0,5.369,1.132,5.369,4.307c0,2.224-1.809,4.032-4.032,4.032c-1.641,0-2.975-1.335-2.975-2.976c0-1.18,0.96-2.14,2.141-2.14
          c0.816,0,1.48,0.664,1.48,1.48c0,0.529-0.43,0.96-0.959,0.96c-0.552,0-1,0.447-1,1s0.448,1,1,1c1.632,0,2.959-1.328,2.959-2.96
          c0-1.919-1.562-3.48-3.48-3.48c-2.283,0-4.141,1.857-4.141,4.14c0,2.743,2.232,4.976,4.975,4.976c3.326,0,6.032-2.706,6.032-6.032
          C45.649,24.513,42.688,21.979,38.28,21.979z"/>
        <path d="M30.649,37.979c-7.29,0-12,3.925-12,10c0,1.117,0.129,2.696,1.244,3.505c1.269,0.921,3.034,0.345,5.079-0.321
          c1.7-0.555,3.628-1.184,5.677-1.184s3.977,0.629,5.677,1.184c1.282,0.418,2.455,0.8,3.464,0.8c0.6,0,1.142-0.135,1.615-0.479
          c1.115-0.809,1.244-2.388,1.244-3.505C42.649,41.903,37.938,37.979,30.649,37.979z M26.939,48.489
          c0.589-1.476,2.026-2.524,3.71-2.524c1.684,0,3.121,1.048,3.71,2.524c-1.153-0.291-2.401-0.511-3.71-0.511
          S28.092,48.199,26.939,48.489z M40.23,49.865c-0.444,0.321-1.953-0.171-3.284-0.605c-0.117-0.038-0.24-0.078-0.36-0.117
          c-0.403-2.92-2.908-5.178-5.937-5.178s-5.534,2.258-5.937,5.178c-0.12,0.039-0.244,0.079-0.36,0.117
          c-1.332,0.435-2.84,0.927-3.284,0.605c-0.098-0.071-0.418-0.418-0.418-1.887c0-5.898,5.166-8,10-8s10,2.102,10,8
          C40.649,49.447,40.329,49.794,40.23,49.865z"/>
        <path d="M56.271,18.842c-0.564-4.081-2.323-7.604-4.826-9.668c-0.644-0.531-1.116-1.365-1.403-2.479
          c-0.826-3.209-3.846-5.451-7.694-5.714c-2.141-0.147-3.996,0.518-6.028,1.331c-0.07,0.03-0.154,0.028-0.276-0.05
          c-0.417-1.106-1.361-1.867-2.658-2.142c-3.007-0.638-7.636,1.31-11.354,4.691c0.006-0.891,0.192-1.687,0.696-1.938l1.685-0.843
          L22.77,1.108c-1.737-0.978-5.924-2.039-9.334,0.944c-1.238,1.082-2.137,2.596-2.599,4.377c-0.094,0.364-0.19,0.755-0.277,1.14
          c-0.038,0.166-0.174,0.216-0.23,0.229c-0.11,0.024-0.198-0.001-0.299-0.122C9.497,7.025,8.688,6.708,7.86,6.819
          C7.064,6.931,6.398,7.441,6.08,8.181c-1.968,4.567-5.65,16.191,2.2,26.139v16.658c0,2.757,2.243,5,5,5h3v1.694
          c0,1.271,1.034,2.306,2.305,2.306h23.39c1.271,0,2.305-1.034,2.305-2.306v-1.694h3c2.757,0,5-2.243,5-5V34.373
          C53.452,33.053,57.503,27.761,56.271,18.842z M7.917,8.972C7.933,8.935,7.981,8.822,8.139,8.8c0.063-0.006,0.218-0.012,0.329,0.124
          l0.064,0.078c0.555,0.661,1.421,0.946,2.27,0.739c0.861-0.209,1.516-0.874,1.709-1.734c0.082-0.362,0.173-0.731,0.262-1.076
          c0.361-1.39,1.045-2.557,1.98-3.373c2.095-1.833,4.415-1.596,5.8-1.195c-0.5,0.948-0.648,2.279-0.419,3.912
          c0.075,0.538,0.443,0.979,0.959,1.149c0.522,0.174,1.089,0.036,1.477-0.357c3.808-3.865,8.198-5.457,10.4-4.99
          c0.941,0.199,1.137,0.72,1.201,0.891c0.198,0.525,0.596,0.941,1.123,1.173c0.556,0.246,1.2,0.256,1.769,0.029
          c1.865-0.747,3.421-1.305,5.149-1.192c2.366,0.161,5.156,1.353,5.894,4.216c0.395,1.533,1.09,2.719,2.067,3.524
          c1.003,0.827,3.412,3.301,4.117,8.398c0.768,5.555-0.699,9.517-2.009,11.811V18.979v-1.747l-1.507,0.885
          c-2.458,1.444-4.605,1.885-6.385,1.314c-0.276-0.089-0.533-0.2-0.771-0.325c-0.099-0.052-0.18-0.115-0.273-0.172
          c-0.13-0.08-0.268-0.156-0.385-0.244c-0.108-0.08-0.197-0.166-0.294-0.249c-0.084-0.072-0.176-0.141-0.252-0.215
          c-0.107-0.103-0.196-0.206-0.288-0.308c-0.049-0.055-0.107-0.11-0.152-0.164c-0.101-0.121-0.184-0.234-0.265-0.345
          c-0.022-0.031-0.052-0.065-0.072-0.095c-0.09-0.129-0.164-0.246-0.226-0.349c-0.003-0.006-0.009-0.014-0.013-0.02
          c-0.128-0.214-0.193-0.355-0.199-0.369c0,0-0.001-0.001-0.001-0.001l-0.217-0.503l-0.547-0.084
          c-9.591-1.479-14.262,2.537-15.57,3.94c-6.965-0.755-9.986-2.757-10.013-2.774l-0.74-0.513l-0.587,0.683
          c-1.559,1.812-3.355,2.734-4.588,3.188L8.28,20.756v0.697v9.368C3.377,22.633,5.843,13.784,7.917,8.972z M42.28,57.673
          c0,0.169-0.137,0.306-0.305,0.306h-23.39c-0.168,0-0.305-0.137-0.305-0.306v-1.694h24V57.673z M50.28,50.979c0,1.654-1.346,3-3,3
          h-3h-28h-3c-1.654,0-3-1.346-3-3V36.79V22.129c1.231-0.532,2.767-1.422,4.196-2.885c1.408,0.73,4.807,2.158,10.708,2.729
          l0.565,0.055l0.336-0.457c0.038-0.051,3.799-5,13.546-3.676c0.516,0.89,1.797,2.672,4.113,3.429
          c1.952,0.638,4.143,0.404,6.535-0.693v15.718V50.979z"/>
      </svg>
    </div>
  )
}