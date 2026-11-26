// Signatures of accessibility overlay widgets, shared by the Overlay Detector and the URL
// Accessibility Auditor. Patterns are matched case-insensitively against script URLs, inline
// scripts, element ids and classes, and window globals.

export interface OverlayVendor {
  name: string
  scriptPatterns: string[]
  domPatterns: string[]
  globalVars: string[]
  website: string
}

export const OVERLAY_VENDORS: Record<string, OverlayVendor> = {
  accessibe: {
    name: "accessiBe",
    scriptPatterns: ["accessibe.com", "acsbapp.com", "acsbap.com", "acsb.js"],
    domPatterns: ["acsb-trigger", "acsb-widget", "accessibe"],
    globalVars: ["acsbJS", "AccessiBe", "acsb"],
    website: "accessibe.com",
  },
  userway: {
    name: "UserWay",
    scriptPatterns: ["userway.org", "cdn.userway.org"],
    domPatterns: ["userway", "userwayAccessibilityWidget"],
    globalVars: ["UserWay", "userway"],
    website: "userway.org",
  },
  audioeye: {
    name: "AudioEye",
    scriptPatterns: ["audioeye.com", "ws.audioeye.com", "audioeye-client"],
    domPatterns: ["audioeye", "ae-compliance"],
    globalVars: ["AudioEye", "ae_compliance"],
    website: "audioeye.com",
  },
  equalweb: {
    name: "EqualWeb",
    scriptPatterns: ["equalweb.com", "nagich.com", "nagich.co.il"],
    domPatterns: ["equalweb", "nagich", "INDmenu"],
    globalVars: ["__equalweb", "nagich"],
    website: "equalweb.com",
  },
  maxaccess: {
    name: "MaxAccess",
    scriptPatterns: ["maxaccess.io"],
    domPatterns: ["maxaccess"],
    globalVars: ["MaxAccess"],
    website: "maxaccess.io",
  },
  truabilities: {
    name: "TruAbilities",
    scriptPatterns: ["truabilities.com"],
    domPatterns: ["truabilities"],
    globalVars: ["TruAbilities"],
    website: "truabilities.com",
  },
  faciliti: {
    name: "Facil'iti",
    scriptPatterns: ["facil-iti.com", "faciliti.com"],
    domPatterns: ["facil-iti", "faciliti"],
    globalVars: ["faciliti"],
    website: "facil-iti.com",
  },
  reciteme: {
    name: "Recite Me",
    scriptPatterns: ["reciteme.com", "api.reciteme.com"],
    domPatterns: ["recite-me", "reciteme"],
    globalVars: ["reciteMe", "ReciteMe"],
    website: "reciteme.com",
  },
  user1st: {
    name: "User1st",
    scriptPatterns: ["user1st.info"],
    domPatterns: ["user1st"],
    globalVars: ["User1st"],
    website: "user1st.info",
  },
  adacompliance: {
    name: "ADA Compliance",
    scriptPatterns: ["adacompliance.org", "adacomplianceforwebsites.com"],
    domPatterns: ["adacomplia"],
    globalVars: ["adaCompliance"],
    website: "adacompliance.org",
  },
}
