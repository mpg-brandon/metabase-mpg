import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

interface LogoIconProps {
  width?: number;
  height?: number;
  dark?: boolean;
  fill?: string;
}

export const DefaultLogoIcon = ({
  dark = false,
  height = 32,
  width = 96,
}: LogoIconProps) => {
  return (
    <svg
      viewBox="0 0 170 70"
      width={width}
      height={height}
      data-testid="main-logo"
      role="img"
      aria-label="Market Performance Group"
    >
      <title>Market Performance Group</title>
      <image
        href="/app/assets/img/mpg-logo-light-toolbar.svg"
        width="170"
        height="70"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: dark ? "brightness(0) invert(1)" : undefined }}
      />
    </svg>
  );
};

export function LogoIcon(props: LogoIconProps) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
