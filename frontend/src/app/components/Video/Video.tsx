import './Video.css';

function Video() {
  return (
    <div className='videoContainer'>
        <video src="/videoplayback.mp4" controls autoPlay loop muted className='video'></video>
    </div>
  )
}

export default Video