import Image from "next/image";
import logoSvg from "../../../../public/logo.svg";
function Logo() {
  return (
    <>
      <Image
        src={logoSvg}
        alt="logo"
        width={100}
        height={100}
        priority
        loading="eager"
        className="size-6 object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
    </>
  );
}

export default Logo;
