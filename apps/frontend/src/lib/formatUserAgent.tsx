import { ComputerIcon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { UAParser } from "ua-parser-js";

export function getDeviceIcon(userAgent: string) {
  const { device } = UAParser(userAgent);
  return device.is("mobile") ? SmartPhone01Icon : ComputerIcon;
}

export default function UserAgentDisplay({ userAgent }: { userAgent: string }) {
  const { browser, device, os } = UAParser(userAgent);

  const browserName = browser?.name || "Unknown Browser";
  const platformInfo = device.is("mobile")
    ? device?.vendor || os?.name
    : `${os?.name || "Unknown OS"}${os?.version ? ` ${os.version}` : ""}`;

  return (
    <span className="text-foreground">
      {browserName} on {platformInfo}
    </span>
  );
}
