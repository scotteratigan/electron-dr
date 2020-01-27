import React from 'react'

export default function Indicators({ bleeding, dead, joined, stunned }) {
  // stunned = true
  return (
    <div>
      {bleeding && Bleeding()}
      {dead && Dead()}
      {joined && Joined()}
      {stunned && Stunned()}
    </div>
  )
}

function Bleeding() {
  return (
    <div>bleeding</div>
  )
}

function Dead() {
  return (
    <div>dead</div>
  )
}

function Joined() {
  return (
    <div>joined</div>
  )
}

function Stunned() {
  return (
    <div>stunned</div>
  )
}