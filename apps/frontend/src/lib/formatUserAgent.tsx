const parseUserAgent = (userAgent: string) => {
  let deviceInfo = "";
  let browserInfo = "";

  if (userAgent.includes("Windows")) {
    deviceInfo = "Windows";
    if (userAgent.includes("Windows NT 10.0")) deviceInfo = "Windows 10";
    else if (userAgent.includes("Windows NT 6.3")) deviceInfo = "Windows 8.1";
    else if (userAgent.includes("Windows NT 6.2")) deviceInfo = "Windows 8";
    else if (userAgent.includes("Windows NT 6.1")) deviceInfo = "Windows 7";
  } else if (
    userAgent.includes("Macintosh") ||
    userAgent.includes("Mac OS X")
  ) {
    deviceInfo = "Mac";
  } else if (userAgent.includes("iPhone")) {
    deviceInfo = "iPhone";
  } else if (userAgent.includes("iPad")) {
    deviceInfo = "iPad";
  } else if (userAgent.includes("Android")) {
    deviceInfo = "Android";
    if (userAgent.includes("Mobile")) {
      deviceInfo = "Android Phone";
    } else {
      deviceInfo = "Android Tablet";
    }
  } else if (userAgent.includes("Linux")) {
    deviceInfo = "Linux";
  }

  if (userAgent.includes("Firefox/")) {
    browserInfo = "Firefox";
  } else if (userAgent.includes("Edge/") || userAgent.includes("Edg/")) {
    browserInfo = "Edge";
  } else if (userAgent.includes("OPR/") || userAgent.includes("Opera/")) {
    browserInfo = "Opera";
  } else if (
    userAgent.includes("Chrome/") &&
    !userAgent.includes("Chromium/")
  ) {
    browserInfo = "Chrome";
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    browserInfo = "Safari";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
    browserInfo = "Internet Explorer";
  }

  return { deviceInfo, browserInfo };
};

export default function UserAgentDisplay({ userAgent }: { userAgent: string }) {
  const { deviceInfo, browserInfo } = parseUserAgent(userAgent);

  return (
    <span className="text-foreground">
      {deviceInfo || browserInfo
        ? `${browserInfo} on ${deviceInfo}`
        : "Unknown"}
    </span>
  );
}
