import { Check, X } from "lucide-react"
import { wFail, wPass } from "./ui"

/** Pass/fail shown with an icon and a word, never color alone. */
export function Verdict({ pass, passText = "Pass", failText = "Fail" }: { pass: boolean; passText?: string; failText?: string }) {
  const Icon = pass ? Check : X
  return <span className={pass ? wPass : wFail}><Icon aria-hidden="true" focusable="false" strokeWidth={2.5} className="h-3.5 w-3.5" />{pass ? passText : failText}</span>
}
