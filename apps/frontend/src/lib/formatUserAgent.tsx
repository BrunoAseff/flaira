import { UAParser } from "ua-parser-js";

export default function UserAgentDisplay({ userAgent }: { userAgent: string }) {
  const parser = new UAParser(userAgent);
  const { browser, device, os } = parser.getResult();

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
