// Core
import React, { useState, useRef, useEffect } from 'react';
import videoFile from '../../assets/video.mp4';
// Instruments
import './Player.scss';


export const Player = (props) => {

    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ progress, setProgress ] = useState(0);
    const [ isProgressCapturing, setIsProgressCapturing ] = useState(0);
    const [ isVolumeCapturing, setIsVolumeCapturing ] = useState(0.5);
    const [ isSpeedCapturing, setIsSpeedCapturing ] = useState(1);
    const [ isMuted, setIsMuted ] = useState(false); 
    const [ isFullScreen, setIsFullScreen ] = useState(false); 
    const videoRef = useRef(null);

    const playControl = isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>;
    const muteControl = isMuted ? <>&#128263;</> : <> &#128266;</>;

    const togglePlay = () => {
        const method = videoRef.current.paused ? 'play': 'pause';
        videoRef.current[ method ]();
        setIsPlaying(method === 'play');
    }
    const mute = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    }

    const fullScreen = () => {
        const isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        videoRef.current.requestFullScreen = videoRef.current.requestFullScreen || videoRef.current.webkitRequestFullScreen || videoRef.current.mozRequestFullScreen || function () { return false; };
	    document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

        isFullscreen ? document.webkitCancelFullScreen() : videoRef.current.requestFullScreen();
        setIsFullScreen(isFullscreen);
    }

    const skip = (event) => {
        const seconds = event.target.dataset.skip;
        videoRef.current.currentTime += Number.parseFloat(seconds);
    }
    
    const handleProgress = () => {
        const percent = videoRef.current.currentTime / videoRef.current.duration * 100;
        setProgress(percent);
    }

    const scrub = (event) => {

        const scrubTime 
            = event.nativeEvent.offsetX / event.currentTarget.offsetWidth 
            * videoRef.current.duration;
        
        videoRef.current.currentTime = scrubTime;
    }
    const handleVolume = (event) => {

        const volumeLevel = event.currentTarget.value;
        videoRef.current.volume = volumeLevel;
    }

    const handleSpeed = (event) => {
        const speed = event.currentTarget.value;
        console.log(speed);
        videoRef.current.playbackRate = speed;
    }

    useEffect(() => {
        const handler = (event) => {
            if( event.code === 'Space' ) {
                togglePlay();
            }
        }
        // Добавляем лисенер на нажатие пробела
        document.addEventListener('keydown', handler);

        //Удаляем лисенер после удаления компонента 
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className = 'player'>
            <video 
                ref = { videoRef }
                src = { videoFile }
                onClick = { togglePlay }  
                onTimeUpdate = { handleProgress }
            />
            <div className = 'controls'>
                <div 
                    className = 'progress'
                    onClick = { scrub }
                    onMouseDown = { () => setIsProgressCapturing(true) }
                    onMouseMove = { (event) => isProgressCapturing && scrub(event)  }
                    onMouseUp = { () => setIsProgressCapturing(false) }>
                    <div 
                    className = 'filled' 
                    style = {{
                        '--filledProgressBar': `${progress}%`
                    }}
                    />
                </div>
                <button 
                    title = 'Toggle Play'
                    onClick = { togglePlay }
                >{playControl}</button>
                <input
                    className = 'slider'
                    max = '1'
                    min = '0' 
                    name = 'volume'
                    step = '0.05'
                    type = 'range'
                    onClick = { handleVolume }
                    onMouseDown = { () => setIsVolumeCapturing(true) }
                    onMouseMove = { (event) => isVolumeCapturing && handleVolume(event)  }
                    onMouseUp = { () => setIsVolumeCapturing(false) }
                />
                <button 
                    title = 'Mute/Unmute'
                    onClick = { mute }
                >{muteControl}</button>
                <input
                    className = 'slider'
                    max = '3'
                    min = '0.5' 
                    name = 'speed'
                    step = '0.1'
                    type = 'range'
                    onChange = { handleSpeed }
                    onMouseDown = { () => setIsSpeedCapturing(true) }
                    onMouseMove = { (event) => isSpeedCapturing && handleSpeed(event)  }
                    onMouseUp = { () => setIsSpeedCapturing(false) }
                />
                <button 
                    data-skip = '-10'
                    onClick = { skip }>
                « 10s</button>
                <button 
                    data-skip = '25'
                    onClick = { skip }>
                25s »</button>
                <button
                    onClick = { fullScreen }
                >&#10021;</button>
            </div>
        </div>
    );
};

export default Player;