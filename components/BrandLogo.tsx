type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M18 18h92v92H18V18Z" stroke="var(--green)" strokeWidth="4" />
        <path d="M18 54h24M86 18v26M110 74H86v36" stroke="var(--brand-plan-line)" strokeWidth="2" />
        <path d="M32 40l19 49 19-49" stroke="var(--text)" strokeWidth="8" />
        <path d="M96 40H78L64 54v20l14 14h20V66H82" stroke="var(--text)" strokeWidth="8" />
        <path d="M52 18v12M18 88h12M98 98h12" stroke="var(--green)" strokeWidth="4" />
      </g>
    </svg>
  );
}
