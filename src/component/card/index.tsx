import React from 'react'
import './index.css'

const Card:React.FC =({children})=>{
   return <div className="card" style={{background:'#41464f'}}>{children}</div>
}

export default Card