import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

interface LogoIconProps {
  width?: number;
  height?: number;
  dark?: boolean;
  fill?: string;
}

export const DefaultLogoIcon = ({
  height = 32,
  width,
}: LogoIconProps) => {
  return (
    <svg
      viewBox="0 0 125 125"
      width={width}
      height={height}
      data-testid="main-logo"
      role="img"
      aria-label="MPG SmartBIT"
    >
      <title>MPG SmartBIT</title>
      <image
        href="/app/assets/img/mpg-smartbit-mark.png"
        width="125"
        height="125"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
};

export function LogoIcon(props: LogoIconProps) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
