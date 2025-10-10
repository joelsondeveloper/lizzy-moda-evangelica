import Image, { StaticImageData } from "next/image";

interface BannerHomeProps {
    images: string[]
}

const BannerHome: React.FC<BannerHomeProps> = ({images}) => {
  return (
    <section className="banner-home w-screen relative">
      <div className="wrapper relative w-full">
          {images.map((image, index) => (
            <Image key={index} src={image} width={1920} height={600} alt="banner" className="object-contain h-auto w-full" />
          ))}
      </div>
    </section>
  )
}

export default BannerHome
