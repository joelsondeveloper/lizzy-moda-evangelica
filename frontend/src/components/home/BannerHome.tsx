"use client"

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

interface BannerHomeProps {
    images: {
        url: string;
        alt: string;
        src: string;
    }[];
}

const BannerHome: React.FC<BannerHomeProps> = ({images}) => {

  const router = useRouter();

  const handleBannerClick = (url: string) => {
    router.push(url);
  }

  return (
    <section className="banner-home w-screen relative">
      <div className="wrapper relative w-full">
          {images.map((image, index) => (
            <Image key={index} src={image.src} width={1920} height={600} alt={image.alt} className="object-contain h-auto w-full cursor-pointer" onClick={() => handleBannerClick(image.url)} />
          ))}
      </div>
    </section>
  )
}

export default BannerHome
