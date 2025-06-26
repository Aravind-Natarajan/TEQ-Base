import React from 'react';
import { Link } from 'react-router-dom';
import A from './assets/T4TEQ-01.png' 
import './home.css'

function home() {
  return (
    <>
    <div className="main">
        <div className="content">
          <div className="text">
            <a href="https://t4teq.com" target='_blank'><img src={A} alt="logo" className='home-logo'/></a>
            <h1 className='home-title'>T<span>4</span>TEQ Software Solutions</h1>
          </div>
          <div className="entry_btn">
            <Link to="/admin"><button>admin</button></Link>
            <Link to="/login"><button>employee</button></Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default home