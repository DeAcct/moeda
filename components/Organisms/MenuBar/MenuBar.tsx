import GlassContainer from "@/components/Atoms/GlassContainer";
import Logo from "@/components/Atoms/Logo/Logo";
import Style from "./MenuBar.module.scss";

export default function MenuBar() {
  return (
    <header className={Style.menuBar}>
      <GlassContainer className={Style.bg}></GlassContainer>
      <Logo className={Style.logo} />
    </header>
  );
}
