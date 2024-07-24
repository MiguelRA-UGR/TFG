import React from 'react'
import Avatar from './Avatar'

const Thread = ({thread}) => {
  return (
    <div className="card w-100">
        <div className="card-header d-flex align-items-center justify-content-between">
            <div className='d-flex flex-row align-items-center'>
                <Avatar
                user={thread.author}
                outerSize="50px"
                innerSize="40px"
                flagSize="0px"
                />
                <h5 style={{marginLeft:"10px"}}>{thread.title}</h5>
            </div> 
        </div>
        <div className="card-body">
            <p className="card-text">{thread.content}</p>
            {thread.url && (
            <img
                src={`http://localhost:4000${thread.url}`}
                alt={thread.title}
                className="img-fluid"
                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
            />
            )}
        </div>
    </div>
  )
}

export default Thread