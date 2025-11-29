import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = ({ onMinimizeChange }) => {
    // Load music files
    const musicModules = import.meta.glob('../assets/music/*.mp3', { eager: true });
    const playlist = Object.keys(musicModules).map((path) => ({
        path: musicModules[path].default,
        name: path.split('/').pop().replace('.mp3', '').split('-')[0].trim() // Clean up filename for display
    }));

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isMinimized, setIsMinimized] = useState(true);
    const audioRef = useRef(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Notify parent about minimize state changes
    useEffect(() => {
        if (onMinimizeChange) {
            onMinimizeChange(isMinimized);
        }
    }, [isMinimized, onMinimizeChange]);

    useEffect(() => {
        // Attempt to autoplay on load
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.5; // Set default volume
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay blocked by browser. Waiting for interaction.");
                    setIsPlaying(false);
                }
            }
        };

        if (playlist.length > 0) {
            playAudio();
        }

        // Add global click listener to start audio if autoplay was blocked
        const handleInteraction = () => {
            if (!hasInteracted && audioRef.current && audioRef.current.paused) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    setHasInteracted(true);
                }).catch(e => console.log("Still blocked", e));
            }
        };

        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, [hasInteracted]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const nextTrack = () => {
        let nextIndex = (currentTrackIndex + 1) % playlist.length;
        setCurrentTrackIndex(nextIndex);
        // Auto play next track
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    const handleEnded = () => {
        nextTrack();
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setProgress((current / total) * 100);
            setDuration(total);
        }
    };

    const handleSeek = (e) => {
        if (audioRef.current) {
            const seekTime = (e.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            setProgress(e.target.value);
        }
    };

    if (playlist.length === 0) return null;

    return (
        <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-out ${isMinimized ? 'w-12' : 'w-80'}`}>
            <audio
                ref={audioRef}
                src={playlist[currentTrackIndex].path}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
            />

            <div className={`relative bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 ${isMinimized ? 'h-12 rounded-full' : 'h-24'}`}>

                {/* Background Gradient Mesh */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 pointer-events-none" />

                <div className={`flex items-center h-full relative z-10 ${isMinimized ? 'justify-center px-0' : 'px-1'}`}>
                    {/* Album Art / Toggle Button */}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className={`relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-white/20 shadow-lg group transition-transform duration-300 ${isMinimized ? 'mx-0 scale-100' : 'mx-2 scale-90'}`}
                        title={isMinimized ? "Click to Expand" : "Click to Minimize"}
                    >
                        <div className={`w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                            <div className="w-4 h-4 bg-black rounded-full border border-gray-700 relative z-10"></div>
                            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-20"></div>
                        </div>
                        {/* Play overlay on hover when minimized */}
                        {isMinimized && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-white">↔</span>
                            </div>
                        )}
                    </button>

                    {/* Expanded Controls */}
                    <div className={`flex-1 flex flex-col justify-center min-w-0 transition-all duration-300 ${isMinimized ? 'opacity-0 w-0 translate-x-10 pointer-events-none' : 'opacity-100 w-auto px-2'}`}>

                        {/* Song Info */}
                        <div className="mb-1 overflow-hidden relative h-6 w-full">
                            <div className="whitespace-nowrap absolute animate-marquee text-white font-bold text-sm tracking-wide">
                                {playlist[currentTrackIndex].name} <span className="mx-4 text-white/40">•</span> {playlist[currentTrackIndex].name}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-white/10 rounded-full mb-2 cursor-pointer group/bar relative">
                            <div
                                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress || 0}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] text-gray-400 font-mono">
                                {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
                            </span>

                            <div className="flex items-center gap-4">
                                <button onClick={togglePlay} className="text-white hover:text-blue-300 transition-colors transform hover:scale-110 active:scale-95">
                                    {isPlaying ? (
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                                    ) : (
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    )}
                                </button>
                                <button onClick={nextTrack} className="text-white hover:text-purple-300 transition-colors transform hover:scale-110 active:scale-95">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                                </button>
                            </div>

                            <span className="text-[10px] text-gray-400 font-mono">
                                {audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 6s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: inline-block;
                    padding-left: 100%;
                    animation: marquee 10s linear infinite;
                }
                /* Hide default range slider thumb */
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                }
            `}</style>
        </div>
    );
};

// Helper for time formatting
const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default MusicPlayer;
