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
        className=" object-cotain size-6"
      />
    </>
  );
}

export default Logo;
