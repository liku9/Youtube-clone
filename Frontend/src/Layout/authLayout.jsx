import React from 'react'
import { Outlet } from 'react-router-dom'

const authLayout = () => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default authLayout