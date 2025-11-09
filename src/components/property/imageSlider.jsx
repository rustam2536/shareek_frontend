import React, { useRef, useState } from 'react';
import './imageSlider.css';
import { imageUrl } from '../../enum/enum';

const VideoItem = ({ videoSrc, index, isActive, onPlay }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // When isActive changes to false, pause this video
    React.useEffect(() => {
        if (!isActive && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isActive]);

    const handleTogglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            video.currentTime = 0;
            setIsPlaying(false);
        } else {
            video
                .play()
                .then(() => {
                    setIsPlaying(true);
                    onPlay(index); // notify parent
                })
                .catch((err) => {
                    console.error('Play failed:', err);
                });
        }
    };

    return (
        <div className="video-wrapper">
            <video
                ref={videoRef}
                src={videoSrc}
                className="thumb-media"
                muted
                loop
                playsInline
            />
            <div className={"play-icon " + (isPlaying ? 'pt-1' : '')} onClick={handleTogglePlay}>
                {isPlaying ? '⏸' : '▶'}
            </div>
            <div className="reel-checkbox">
                <input type="checkbox" id={`check-reel-${index}`} className='mt-2 mx-2' />
                <label htmlFor={`check-reel-${index}`}>Show in Reels?</label>
            </div>
        </div>
    );
};

const ImageSlider = ({ images = [], videos = [] }) => {
    const scrollContainerRef = useRef(null);
    const [activeVideoIndex, setActiveVideoIndex] = useState(null);

    // Combine images and videos
    const slides = [
        ...images.map((img) => ({ type: 'image', src: img })),
        ...videos.map((vid) => ({ type: 'video', src: vid?.fileName })),
    ];

    const scroll = (direction) => {
        const { current } = scrollContainerRef;
        const scrollAmount = 200; // adjust as needed
        if (current) {
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="row-slider-wrapper">
            {
                slides?.length == 0 ? (
                    <div>
                        <img src="/assets/images/no-image.jpeg" alt="default" />
                    </div>
                ) : (
                    <>
                        {slides?.length > 2 ? <div className="arrow left" onClick={() => scroll('left')}>❮</div> : null}

                        <div className="row-slider" ref={scrollContainerRef}>
                            {slides.map((slide, index) => (
                                <div className="row-slide-item" key={index}>
                                    {slide.type === 'image' ? (
                                        <img
                                            src={imageUrl + slide.src}
                                            alt={`slide-${index}`}
                                            className="thumb-media"
                                        />
                                    ) : (
                                        <VideoItem
                                            videoSrc={imageUrl + slide.src}
                                            index={index}
                                            isActive={activeVideoIndex === index}
                                            onPlay={setActiveVideoIndex}
                                        />
                                    )}

                                </div>
                            ))}
                        </div>

                        {slides?.length > 2 ? <div className="arrow right" onClick={() => scroll('right')}>❯</div> : null}
                    </>
                )}
        </div>
    );
};

export default ImageSlider;


// import React, { useEffect, useState } from 'react';
// import './imageSlider.css';
// import { imageUrl } from '../../enum/enum';

// const ImageSlider = ({ images = [], videos = [] }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);

//     // Merge images and videos into a unified slide list
//     const slides = [
//         ...images.map((img) => ({ type: 'image', src: img })),
//         ...videos.map((vid) => ({ type: 'video', src: vid })),
//     ];

//     const goToPrevious = () => {
//         const isFirst = currentIndex === 0;
//         const newIndex = isFirst ? slides.length - 1 : currentIndex - 1;
//         setCurrentIndex(newIndex);
//     };

//     const goToNext = () => {
//         const isLast = currentIndex === slides.length - 1;
//         const newIndex = isLast ? 0 : currentIndex + 1;
//         setCurrentIndex(newIndex);
//     };

//     const goToSlide = (index) => {
//         setCurrentIndex(index);
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             goToNext();
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [currentIndex]);

//     const currentSlide = slides[currentIndex];

//     return (
//         <div className="slider">
//             <div className="left-arrow" onClick={goToPrevious}>❮</div>
//             <div className="right-arrow" onClick={goToNext}>❯</div>

//             <div className="slide">
//                 {currentSlide?.type === 'image' ? (
//                     <img
//                         src={imageUrl + currentSlide.src}
//                         alt="slide"
//                         className="slide-media"
//                     />
//                 ) : (
//                     <video
//                         className="slide-media"
//                         controls
//                         autoPlay
//                         muted
//                         loop
//                         src={imageUrl + currentSlide?.src}
//                     />
//                 )}
//             </div>

//             <div className="dots">
//                 {slides.map((_, index) => (
//                     <div
//                         key={index}
//                         className={`dot ${currentIndex === index ? 'active' : ''}`}
//                         onClick={() => goToSlide(index)}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ImageSlider;
