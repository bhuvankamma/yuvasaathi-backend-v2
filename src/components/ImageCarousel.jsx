// src/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import your images
import cmm from '../assets/cmm.jpg';
import mp from '../assets/mp.webp';
import biharMapImage from '../assets/biharmap.jpg';
import hs from '../assets/hs.jpg';
import schemeImage from '../assets/Scheme.jpg';
import farmingImage from '../assets/people.jpg'; 

const ImageCarousel = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  // Array of imported image variables
  const importedImages = [
    cmm,
    mp,
    biharMapImage,
    hs,
    schemeImage,
    farmingImage
  ];

  useEffect(() => {
    // 💡 FIX 1: Safely get translated images and combine them with imported image sources.
    // The `t` function is guaranteed to return a correct value after `i18n` is ready.
    // Using `useEffect` ensures this runs after the component mounts.
    const translatedImages = t('carousel_images', { returnObjects: true });

    // 💡 FIX 2: Check if translatedImages is an array before mapping.
    if (Array.isArray(translatedImages) && translatedImages.length > 0) {
      const combinedImages = translatedImages.map((image, index) => {
        return {
          ...image,
          src: importedImages[index]
        };
      });
      setImages(combinedImages);
    }
    
    // 💡 FIX 3: Re-run this effect when the language changes to update images.
  }, [i18n.language]);

  // Autoplay functionality
  useEffect(() => {
    if (images.length === 0) return; // Prevent interval from running if no images are loaded
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Render a loading state or nothing if images are not yet loaded
  if (images.length === 0) {
    return <div>Loading images...</div>;
  }

  return (
    <section className="relative w-full mx-auto my-8 shadow-xl rounded-lg overflow-hidden transition-all duration-300">
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        className="w-full h-80 md:h-[28rem] object-cover transition-opacity duration-700 ease-in-out"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white text-center">
        <p className="text-lg font-semibold">{images[currentIndex].description}</p>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 w-2.5 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            } transition-colors duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default ImageCarousel;