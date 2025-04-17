import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PostImageSlider = ({ images }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="w-full rounded-lg"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Post Image ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PostImageSlider;
