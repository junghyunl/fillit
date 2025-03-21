import { ImageSlideIcon } from '@/assets/assets';
import { useState, useEffect } from 'react';
import { DeleteRedIcon } from '@/assets/assets';

interface ImageSliderProps {
  images: string[];
  onRemove?: (index: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onRemove }) => {
  const [isError, setIsError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(images.length > 0 ? images.length - 1 : 0);
    }
  }, [images, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (images.length === 0) return null;

  return (
    <div className="relative max-w-[13rem]">
      {isError ? (
        <div className="object-cover w-full min-w-[13rem] aspect-[1/1] rounded-md flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">Unable to load image</span>
        </div>
      ) : (
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="object-cover w-full aspect-[1/1] rounded-md"
          onError={() => {
            setIsError(true);
          }}
        />
      )}
      {onRemove && (
        <button onClick={() => onRemove(currentIndex)}>
          <img
            src={DeleteRedIcon}
            className="absolute top-0 right-0 rounded-full"
          />
        </button>
      )}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 pt-1 -left-5 transform rotate-180 -translate-y-1/2"
          >
            <img src={ImageSlideIcon} alt="image-slide-icon" className="h-14" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 pt-1 -right-5 transform -translate-y-1/2"
          >
            <img src={ImageSlideIcon} alt="image-slide-icon" className="h-14" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-400'
                }`}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
