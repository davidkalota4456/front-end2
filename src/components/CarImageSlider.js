

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/CarImageSlider.css';



const CarImageSlider = ({ imagePaths }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="car-image-slider">
      <Slider {...settings}>
        {imagePaths.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Car ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default CarImageSlider;



