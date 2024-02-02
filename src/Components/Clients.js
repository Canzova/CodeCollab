import React from 'react'
import Avatar from 'react-avatar'

export default function Clients({username}) {
  return (
    <div className='client'>
      {/* Avatar */}
      <Avatar name={username} size={50} round="14px"/>
      <span className='userName'>{username}</span>
    </div>
  )
  }
