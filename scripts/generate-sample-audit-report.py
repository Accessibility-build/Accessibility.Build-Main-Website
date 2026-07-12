#!/usr/bin/env python3

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "sample-accessibility-audit-report.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "downloads" / "sample-accessibility-audit-report.pdf"

NAVY = colors.HexColor("#07111F")
BLUE = colors.HexColor("#2563EB")
TEAL = colors.HexColor("#0F766E")
TEXT = colors.HexColor("#172033")
MUTED = colors.HexColor("#526075")
LINE = colors.HexColor("#D5DCE5")
PALE = colors.HexColor("#F4F7FA")
RED = colors.HexColor("#B42318")
ORANGE = colors.HexColor("#C2410C")
AMBER = colors.HexColor("#A16207")


def register_fonts():
    regular = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
    bold = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("ABSans", str(regular)))
        pdfmetrics.registerFont(TTFont("ABSans-Bold", str(bold)))
        return "ABSans", "ABSans-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverEyebrow",
    fontName=FONT_BOLD,
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#7DD3FC"),
    spaceAfter=10,
    uppercase=True,
))
styles.add(ParagraphStyle(
    name="CoverTitle",
    fontName=FONT_BOLD,
    fontSize=30,
    leading=35,
    textColor=colors.white,
    spaceAfter=14,
))
styles.add(ParagraphStyle(
    name="CoverSub",
    fontName=FONT,
    fontSize=14,
    leading=21,
    textColor=colors.HexColor("#CBD5E1"),
))
styles.add(ParagraphStyle(
    name="H1AB",
    fontName=FONT_BOLD,
    fontSize=22,
    leading=27,
    textColor=NAVY,
    spaceBefore=6,
    spaceAfter=14,
))
styles.add(ParagraphStyle(
    name="H2AB",
    fontName=FONT_BOLD,
    fontSize=15,
    leading=19,
    textColor=NAVY,
    spaceBefore=14,
    spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="H3AB",
    fontName=FONT_BOLD,
    fontSize=11,
    leading=15,
    textColor=TEXT,
    spaceBefore=8,
    spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="BodyAB",
    fontName=FONT,
    fontSize=9.5,
    leading=14.5,
    textColor=TEXT,
    spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="SmallAB",
    fontName=FONT,
    fontSize=8,
    leading=12,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="LabelAB",
    fontName=FONT_BOLD,
    fontSize=7.5,
    leading=10,
    textColor=MUTED,
    uppercase=True,
))
styles.add(ParagraphStyle(
    name="FindingTitle",
    fontName=FONT_BOLD,
    fontSize=16,
    leading=21,
    textColor=NAVY,
    spaceAfter=8,
))


findings = [
    {
        "id": "NS-001",
        "severity": "Critical",
        "severity_color": RED,
        "title": "Order review dialog does not keep keyboard focus within the modal",
        "criteria": "2.1.2 No Keyboard Trap; 2.4.3 Focus Order",
        "impact": "Keyboard and screen-reader users can move into content behind the open dialog and lose the relationship between the review task and available actions.",
        "evidence": [
            "Open the order review dialog from the payment step.",
            "Press Tab repeatedly after focus reaches the final dialog action.",
            "Focus moves to the page navigation behind the modal while the modal remains visible.",
        ],
        "remediation": "Use a native dialog implementation or a tested modal pattern. Move focus to a meaningful element when the dialog opens, constrain sequential focus while it is modal, support Escape where appropriate, and restore focus to the invoking control when it closes.",
    },
    {
        "id": "NS-002",
        "severity": "High",
        "severity_color": ORANGE,
        "title": "Address validation errors are not announced after submission",
        "criteria": "3.3.1 Error Identification; 4.1.3 Status Messages",
        "impact": "A screen-reader user receives no programmatic notification that submission failed or which fields need correction.",
        "evidence": [
            "Leave the postal code and city fields empty.",
            "Activate Continue.",
            "Visual error text appears, but focus remains on Continue and no status or error summary is announced.",
        ],
        "remediation": "Provide an error summary with links to invalid fields, move focus to the summary after unsuccessful submission, associate each field error using aria-describedby, and maintain aria-invalid until the value is corrected.",
    },
    {
        "id": "NS-003",
        "severity": "Medium",
        "severity_color": AMBER,
        "title": "Visible payment option text is not included in the accessible name",
        "criteria": "2.5.3 Label in Name; 4.1.2 Name, Role, Value",
        "impact": "Speech-input users cannot reliably activate the option by saying the visible label, and screen-reader output differs from the text presented visually.",
        "evidence": [
            "Inspect the option labelled Pay by bank transfer.",
            "Its accessible name is Transfer payment method.",
            "The visible words Pay by bank transfer are not contained in the computed name.",
        ],
        "remediation": "Use the visible text as the control's accessible name. Prefer an associated native label and remove the conflicting aria-label unless additional context is genuinely required.",
    },
    {
        "id": "NS-004",
        "severity": "Medium",
        "severity_color": AMBER,
        "title": "Order summary requires horizontal scrolling at 400 percent zoom",
        "criteria": "1.4.10 Reflow",
        "impact": "People using browser zoom must repeatedly scroll in two dimensions to compare item names, quantities, and totals.",
        "evidence": [
            "Set a 1280 CSS pixel viewport and zoom the browser to 400 percent.",
            "Navigate to the order review step.",
            "The summary table retains a fixed minimum width and creates horizontal page scrolling.",
        ],
        "remediation": "Replace the fixed-width layout with a responsive summary pattern. Allow labels and values to wrap, move secondary metadata below the item name, and test at an effective viewport width of 320 CSS pixels.",
    },
]


def p(text, style="BodyAB"):
    return Paragraph(text, styles[style])


def bullets(items):
    rows = []
    for item in items:
        rows.append([p("-", "BodyAB"), p(item, "BodyAB")])
    table = Table(rows, colWidths=[5 * mm, 151 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("TEXTCOLOR", (0, 0), (0, -1), BLUE),
    ]))
    return table


def numbered_steps(items):
    rows = []
    for index, item in enumerate(items, 1):
        rows.append([p(str(index), "LabelAB"), p(item, "BodyAB")])
    table = Table(rows, colWidths=[8 * mm, 148 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("TEXTCOLOR", (0, 0), (0, -1), BLUE),
    ]))
    return table


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(doc.leftMargin, 15 * mm, width - doc.rightMargin, 15 * mm)
    canvas.setFont(FONT, 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 9.5 * mm, "Accessibility.build - Fictional sample audit report")
    canvas.drawRightString(width - doc.rightMargin, 9.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


def cover(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(TEAL)
    canvas.rect(0, height - 7 * mm, width, 7 * mm, fill=1, stroke=0)
    canvas.restoreState()


def build_story():
    story = []
    story.extend([
        Spacer(1, 55 * mm),
        p("PUBLIC SAMPLE DELIVERABLE", "CoverEyebrow"),
        p("Sample Accessibility Audit Report", "CoverTitle"),
        p("Northstar Checkout - fictional demonstration product", "CoverSub"),
        Spacer(1, 22 * mm),
    ])

    cover_meta = Table([
        [p("Prepared by", "LabelAB"), p("Khushwant Parihar", "SmallAB")],
        [p("Target", "LabelAB"), p("WCAG 2.2 Level A and AA", "SmallAB")],
        [p("Version", "LabelAB"), p("1.0", "SmallAB")],
        [p("Issued", "LabelAB"), p("July 12, 2026", "SmallAB")],
    ], colWidths=[28 * mm, 85 * mm], hAlign="LEFT")
    cover_meta.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEABOVE", (0, 0), (-1, 0), 0.5, colors.HexColor("#475569")),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#334155")),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(cover_meta)
    story.append(Spacer(1, 20 * mm))
    disclosure = Table([[p(
        "Northstar Checkout is fictional and exists only to demonstrate report structure. This is not a client endorsement, conformance claim, or legal opinion. An accessible HTML equivalent is available at accessibility.build/sample-audit-report.",
        "SmallAB",
    )]], colWidths=[155 * mm])
    disclosure.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#172033")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#475569")),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#E2E8F0")),
    ]))
    story.extend([disclosure, PageBreak()])

    story.extend([
        p("Executive summary", "H1AB"),
        p("The fictional checkout sample contains four confirmed accessibility findings across modal focus, error communication, accessible names, and responsive reflow. Findings are prioritized by user impact, not by automated rule count. This limited sample cannot establish full product conformance."),
        Spacer(1, 5 * mm),
    ])

    summary_table = Table([
        [p("Critical", "LabelAB"), p("1", "H2AB"), p("High", "LabelAB"), p("1", "H2AB"), p("Medium", "LabelAB"), p("2", "H2AB")],
    ], colWidths=[22 * mm, 20 * mm, 22 * mm, 20 * mm, 24 * mm, 20 * mm])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (1, 0), "CENTER"),
        ("ALIGN", (3, 0), (3, 0), "CENTER"),
        ("ALIGN", (5, 0), (5, 0), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.extend([
        summary_table,
        p("Scope", "H2AB"),
        bullets(["Checkout entry page", "Delivery address form", "Payment method step", "Order review dialog", "Confirmation state"]),
        p("Test environments", "H2AB"),
        bullets([
            "Chrome with NVDA on Windows",
            "Safari with VoiceOver on macOS",
            "Keyboard-only interaction",
            "Browser zoom and responsive reflow review",
            "Automated axe-based checks used as supporting evidence",
        ]),
        p("Limitations", "H2AB"),
        bullets([
            "This sample covers five representative states, not every possible checkout configuration.",
            "No disabled-user research is represented in this fictional sample.",
            "Legal compliance and full product conformance cannot be established from this sample.",
        ]),
        PageBreak(),
        p("Detailed findings", "H1AB"),
        p("Each finding includes a confirmed barrier, criterion mapping, user impact, reproducible evidence, and remediation direction. Verification is a separate retest state."),
    ])

    for index, finding in enumerate(findings):
        severity = Table([[p(finding["id"], "LabelAB"), p(finding["severity"] + " severity", "LabelAB"), p("Open in sample", "SmallAB")]], colWidths=[30 * mm, 38 * mm, 86 * mm])
        severity.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PALE),
            ("BOX", (0, 0), (-1, -1), 0.5, LINE),
            ("TEXTCOLOR", (1, 0), (1, 0), finding["severity_color"]),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ]))
        content = [
            severity,
            Spacer(1, 4 * mm),
            p(finding["title"], "FindingTitle"),
            p("Mapped criteria", "H3AB"),
            p(finding["criteria"]),
            p("User impact", "H3AB"),
            p(finding["impact"]),
            p("Reproduction evidence", "H3AB"),
            numbered_steps(finding["evidence"]),
            p("Remediation guidance", "H3AB"),
            p(finding["remediation"]),
            p("Verification note", "H3AB"),
            p("Retest the corrected behavior in the agreed environment. A code change alone does not close the finding.", "SmallAB"),
        ]
        story.append(KeepTogether(content))
        if index < len(findings) - 1:
            story.extend([Spacer(1, 7 * mm), Table([[""]], colWidths=[156 * mm], rowHeights=[0.5], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), LINE)])), Spacer(1, 7 * mm)])

    story.extend([
        PageBreak(),
        p("Delivery and interpretation", "H1AB"),
        p("Severity is a prioritization aid, not a substitute for reading the user impact and evidence. The final engagement report also identifies scope changes, unresolved dependencies, retest results, and residual risk."),
        p("Status model", "H2AB"),
        bullets([
            "Detected - a tool or reviewer identified a potential issue.",
            "Confirmed - a practitioner validated the barrier and evidence.",
            "Remediation in progress - an implementation change is under review.",
            "Verified - the original failure no longer reproduces in the agreed retest environment.",
            "Residual risk - the issue is partly addressed, out of scope, or dependent on another party.",
        ]),
        p("Important qualification", "H2AB"),
        p("An audit reflects the agreed sample, product version, environment, standard, and date. Product changes may create new barriers. Accessibility.build does not describe a tool score, one-time scan, or limited sample as certification of legal compliance."),
        Spacer(1, 8 * mm),
    ])

    contact = Table([
        [p("Accessibility.build", "H2AB")],
        [p("Founder-led accessibility audits, remediation, training, and practical WCAG tools.")],
        [p("contact@accessibility.build | accessibility.build", "SmallAB")],
    ], colWidths=[156 * mm])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(contact)
    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=24 * mm,
        leftMargin=24 * mm,
        topMargin=22 * mm,
        bottomMargin=23 * mm,
        title="Sample Accessibility Audit Report - Northstar Checkout",
        author="Khushwant Parihar, Accessibility.build",
        subject="Fictional sample accessibility audit report demonstrating scope, evidence, severity, and remediation guidance.",
        creator="Accessibility.build",
    )
    doc.build(build_story(), onFirstPage=cover, onLaterPages=header_footer)
    PUBLIC_OUTPUT.write_bytes(OUTPUT.read_bytes())
    print(f"Generated {OUTPUT}")
    print(f"Copied {PUBLIC_OUTPUT}")


if __name__ == "__main__":
    main()
