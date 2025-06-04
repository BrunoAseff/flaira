import { UAParser } from "ua-parser-js";

export default function UserAgentDisplay({ userAgent }: { userAgent: string }) {
  const { browser, device, os } = UAParser(userAgent);

  const browserName = browser?.name || "Unknown Browser";

  const platformInfo = device.is("mobile")
    ? device?.vendor || "Mobile Device"
    : `${os?.name || "Unknown OS"}${os?.version ? ` ${os.version}` : ""}`;

  return (
    <span className="text-foreground">
      {browserName} on {platformInfo}
    </span>
  );
}
