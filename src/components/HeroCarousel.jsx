import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useData } from '../context/DataContext.jsx';

export default function HeroCarousel() {
  const { promotions } = useData();

  return (
    <div className="card-surface overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {promotions.map((promo) => (
          <SwiperSlide key={promo.id}>
            <div className="relative flex h-full flex-col justify-between bg-cover bg-center p-8" style={{ backgroundImage: `url(${promo.imageUrl})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" aria-hidden />
              <div className="relative max-w-lg space-y-4">
                <span className="inline-flex items-center rounded-full bg-bgfc-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bgfc-gold">
                  BGFC Golden Lions
                </span>
                <h2 className="text-3xl font-display font-bold text-white">{promo.title}</h2>
                <p className="text-base text-white/80">{promo.description}</p>
                <a
                  href={promo.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex w-max"
                >
                  {promo.cta}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
