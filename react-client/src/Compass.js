import React from 'react'

// https://www.flaticon.com/categories/arrows/6 <- svgs which include angled arrows
// https://www.flaticon.com/packs/arrow-20

export default function Compass({ exits }) {
  const { up, down, out, north, northeast, east, southeast, south, southwest, west, northwest } = exits
  return (
    <div style={{ width: 60, height: 45, display: "flex", flexDirection: "row" }}>
      <div>
        <CompassSquare active={northwest} icon={"NW"} path={NorthWest} />
        <CompassSquare active={west} icon={"W"} path={West} />
        <CompassSquare active={southwest} icon={"SW"} path={SouthWest} />
      </div>
      <div>
        <CompassSquare active={north} icon={"N"} path={North} />
        <CompassSquare active={out} icon={"O"} path={Out} />
        <CompassSquare active={south} icon={"S"} path={South} />
      </div>
      <div>
        <CompassSquare active={northeast} icon={"NE"} path={NorthEast} />
        <CompassSquare active={east} icon={"E"} path={East} />
        <CompassSquare active={southeast} icon={"SE"} path={SouthEast} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <CompassSquare active={up} icon={"U"} path={Up} />
        <CompassSquare active={down} icon={"D"} path={Down} />
      </div>
    </div>
  )
}

function CompassSquare({ active, path }) {
  return (
    <div style={{ width: 15, height: 15, textAlign: "center" }}>
      {active &&
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          {path && path()}
        </svg>
      }
    </div>
  )
}

function NorthWest() {
  return <path d="m480.971 480.971a24 24 0 0 1 -33.942 0l-359.029-359.03v-33.941h33.941l359.03 359.029a24 24 0 0 1 0 33.942zm-408.971-192.971v-216h216a24 24 0 0 0 0-48h-240a24 24 0 0 0 -24 24v240a24 24 0 0 0 48 0z" />
}

function North() {
  return <path d="m280 128.569v335.431a24 24 0 0 1 -48 0v-335.431l24-24zm136.971 80.4a24 24 0 0 0 0-33.942l-144-144a24 24 0 0 0 -33.942 0l-144 144a24 24 0 0 0 33.942 33.942l127.029-127.028 127.029 127.03a24 24 0 0 0 33.942 0z" />
}

function NorthEast() {
  return <path d="m424 121.941-359.029 359.03a24 24 0 0 1 -33.942-33.942l359.03-359.029h33.941zm64 166.059v-240a24 24 0 0 0 -24-24h-240a24 24 0 0 0 0 48h216v216a24 24 0 0 0 48 0z" />
}

function East() {
  return <path d="m383.432 280h-335.432a24 24 0 0 1 0-48h335.432l24 24zm-46.461 136.971 144-144a24 24 0 0 0 0-33.942l-144-144a24 24 0 0 0 -33.942 33.942l127.03 127.029-127.03 127.029a24 24 0 0 0 33.942 33.942z" />
}

function SouthEast() {
  return <path d="m390.059 424-359.03-359.029a24 24 0 0 1 33.942-33.942l359.029 359.03v33.941zm97.941 40v-240a24 24 0 0 0 -48 0v216h-216a24 24 0 0 0 0 48h240a24 24 0 0 0 24-24z" />
}

function South() {
  return <path d="m232 383.431v-335.431a24 24 0 0 1 48 0v335.431l-24 24zm40.971 97.54 144-144a24 24 0 0 0 -33.942-33.942l-127.029 127.03-127.029-127.03a24 24 0 0 0 -33.942 33.942l144 144a24 24 0 0 0 33.942 0z" />
}

function SouthWest() {
  return <path d="m480.971 64.971-359.03 359.029h-33.941v-33.941l359.029-359.03a24 24 0 0 1 33.942 33.942zm-168.971 399.029a24 24 0 0 0 -24-24h-216v-216a24 24 0 0 0 -48 0v240a24 24 0 0 0 24 24h240a24 24 0 0 0 24-24z" />
}

function West() {
  return <path d="m488 256a24 24 0 0 1 -24 24h-335.432l-24-24 24-24h335.432a24 24 0 0 1 24 24zm-279.029 160.971a24 24 0 0 0 0-33.942l-127.03-127.029 127.03-127.029a24 24 0 0 0 -33.942-33.942l-144 144a24 24 0 0 0 0 33.942l144 144a24 24 0 0 0 33.942 0z" />
}

function Out() {
  return <path d="m464 488h-416a24 24 0 0 1 -24-24v-416a24 24 0 0 1 24-24h176a24 24 0 0 1 0 48h-152v368h368v-152a24 24 0 0 1 48 0v176a24 24 0 0 1 -24 24zm-40-400h-33.941l-103.03 103.029a24 24 0 0 0 33.942 33.942l103.029-103.03zm64 88v-128a24 24 0 0 0 -24-24h-128a24 24 0 0 0 0 48h104v104a24 24 0 0 0 48 0z" />
}

function Up() {
  return <path d="m280 128.569v223.431a24 24 0 0 1 -48 0v-223.431l24-24zm136.971 80.4a24 24 0 0 0 0-33.942l-144-144a24 24 0 0 0 -33.942 0l-144 144a24 24 0 0 0 33.942 33.942l127.029-127.028 127.029 127.03a24 24 0 0 0 33.942 0zm71.029 255.031a24 24 0 0 0 -24-24h-416a24 24 0 0 0 0 48h416a24 24 0 0 0 24-24z" />
}

function Down() {
  return <path d="m232 271.431v-223.431a24 24 0 0 1 48 0v223.431l-24 24zm40.971 97.54 144-144a24 24 0 0 0 -33.942-33.942l-127.029 127.03-127.029-127.03a24 24 0 0 0 -33.942 33.942l144 144a24 24 0 0 0 33.942 0zm215.029 95.029a24 24 0 0 0 -24-24h-416a24 24 0 0 0 0 48h416a24 24 0 0 0 24-24z" />
}