import React from 'react'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default function Loading() {
  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
      <Loader
      type="TailSpin"
      color="#3F51B5"
      height={100}
      width={100}
      timeout={30000} //30 secs
      />
    </div>
  )
}
