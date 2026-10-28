import { strToU8, zipSync } from "fflate"

// Two small example files, built in the browser, so a visitor can see what a
// report looks like before choosing a file of their own. Each has a handful
// of typical problems and a few things done right. Only the XML parts the
// checker reads are included; neither file is meant to be opened in Office.

const W = `xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"`
const P = `xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"`
const REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
const HEAD = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`

const rels = (items: [string, string, string, boolean?][]) =>
  `${HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items
    .map(([id, type, target, external]) => `<Relationship Id="${id}" Type="${type.startsWith("http") ? type : `${REL}/${type}`}" Target="${target}"${external ? ` TargetMode="External"` : ""}/>`)
    .join("")}</Relationships>`

const core = (title: string) =>
  `${HEAD}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${title}</dc:title></cp:coreProperties>`

const packageRels = (main: string) => rels([["rId1", "officeDocument", main], ["rId2", "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", "docProps/core.xml"]])

// ---- Word

const run = (text: string, props = "") => `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${text}</w:t></w:r>`
const para = (content: string, pPr = "") => `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ""}${content}</w:p>`
const text = (t: string, props = "") => para(run(t, props))
const heading = (level: number, t: string) => para(run(t), `<w:pStyle w:val="Heading${level}"/>`)
const picture = (id: number, name: string, alt: string | null) =>
  `<w:r><w:drawing><wp:inline><wp:extent cx="2743200" cy="1828800"/><wp:docPr id="${id}" name="${name}"${alt ? ` descr="${alt}"` : ""}/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="${name}.jpg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdImg"/></pic:blipFill><pic:spPr/></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`
const cell = (t: string) => `<w:tc>${text(t)}</w:tc>`

export function sampleWordDocument(): Uint8Array {
  const body = [
    heading(1, "Community garden newsletter"),
    text("Spring is here, and the beds by the gate are ready for planting. Thank you to everyone who came to the March work day."),
    para(picture(1, "Picture 1", null)),
    text("Opening hours", "<w:b/>"),
    text("\u2022 Monday to Friday, 9am to 5pm"),
    text("\u2022 Saturday, 10am to 2pm"),
    heading(3, "Volunteer days"),
    para(run("To sign up for a volunteer day, ") + `<w:hyperlink r:id="rIdLink1">${run("click here", `<w:rStyle w:val="Hyperlink"/>`)}</w:hyperlink>` + run(".")),
    `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/></w:tblPr><w:tblGrid><w:gridCol w:w="3000"/><w:gridCol w:w="3000"/></w:tblGrid><w:tr>${cell("Date")}${cell("Task")}</w:tr><w:tr>${cell("12 April")}${cell("Planting potatoes")}</w:tr><w:tr>${cell("26 April")}${cell("Building the compost bays")}</w:tr></w:tbl>`,
    "<w:p/><w:p/><w:p/>",
    heading(2, "From the committee"),
    para(picture(2, "Picture 2", "Volunteers laying the new path between the raised beds")),
    text("Plot rents are due by the end of May.", `<w:color w:val="A6A6A6"/>`),
    para(
      run("Questions? ") +
        `<w:r><w:drawing><wp:anchor behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1" relativeHeight="3" simplePos="0"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="column"><wp:posOffset>0</wp:posOffset></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>0</wp:posOffset></wp:positionV><wp:extent cx="1828800" cy="914400"/><wp:wrapSquare wrapText="bothSides"/><wp:docPr id="3" name="Text Box 3"/><a:graphic><a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><wps:wsp><wps:cNvSpPr txBox="1"/><wps:spPr/><wps:txbx><w:txbxContent>${text("Ask at the shed on Saturdays.")}</w:txbxContent></wps:txbx><wps:bodyPr/></wps:wsp></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r>`,
    ),
  ].join("")

  const styles = `${HEAD}<w:styles ${W}><w:docDefaults><w:rPrDefault><w:rPr><w:sz w:val="22"/><w:lang w:val="en-GB"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>${[1, 2, 3]
    .map((n) => `<w:style w:type="paragraph" w:styleId="Heading${n}"><w:name w:val="heading ${n}"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="${n - 1}"/></w:pPr><w:rPr><w:b/><w:sz w:val="${36 - n * 4}"/></w:rPr></w:style>`)
    .join("")}<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:rPr><w:color w:val="0563C1" w:themeColor="hyperlink"/><w:u w:val="single"/></w:rPr></w:style></w:styles>`

  return zipSync({
    "_rels/.rels": strToU8(packageRels("word/document.xml")),
    "docProps/core.xml": strToU8(core("Community garden newsletter, spring")),
    "word/document.xml": strToU8(`${HEAD}<w:document ${W}><w:body>${body}<w:sectPr/></w:body></w:document>`),
    "word/styles.xml": strToU8(styles),
    "word/_rels/document.xml.rels": strToU8(rels([["rIdStyles", "styles", "styles.xml"], ["rIdImg", "image", "media/image1.jpg"], ["rIdLink1", "hyperlink", "https://example.org/volunteer", true]])),
  })
}

// ---- PowerPoint

let id = 2
const nvSp = (name: string, ph = "") => `<p:nvSpPr><p:cNvPr id="${id++}" name="${name}"/><p:cNvSpPr/><p:nvPr>${ph}</p:nvPr></p:nvSpPr><p:spPr/>`
const pRun = (t: string) => `<a:r><a:rPr lang="en-GB" dirty="0"/><a:t>${t}</a:t></a:r>`
const title = (t: string, type = "title") => `<p:sp>${nvSp("Title 1", `<p:ph type="${type}"/>`)}<p:txBody><a:bodyPr/><a:p>${pRun(t)}</a:p></p:txBody></p:sp>`
const body = (name: string, t: string) => `<p:sp>${nvSp(name, `<p:ph idx="1"/>`)}<p:txBody><a:bodyPr/><a:p>${pRun(t)}</a:p></p:txBody></p:sp>`
const pPic = (name: string, alt: string | null, media = "") =>
  `<p:pic><p:nvPicPr><p:cNvPr id="${id++}" name="${name}"${alt ? ` descr="${alt}"` : ""}/><p:cNvPicPr/><p:nvPr>${media}</p:nvPr></p:nvPicPr><p:blipFill><a:blip r:embed="rIdImg"/></p:blipFill><p:spPr/></p:pic>`
const tableRow = (cells: string[]) => `<a:tr h="370840">${cells.map((c) => `<a:tc><a:txBody><a:bodyPr/><a:p>${pRun(c)}</a:p></a:txBody><a:tcPr/></a:tc>`).join("")}</a:tr>`

export function samplePresentation(): Uint8Array {
  id = 2
  const slides = [
    { shapes: title("Garden open day", "ctrTitle") + body("Subtitle 2", "Saturday 14 June, 10am to 4pm") },
    { shapes: pPic("Picture 3", null) + body("Content Placeholder 2", "Tours of the beds every hour") },
    {
      shapes:
        title("Timetable") +
        `<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="${id++}" name="Table 4"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr><p:xfrm/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr bandRow="1"/><a:tblGrid><a:gridCol w="3000000"/><a:gridCol w="3000000"/></a:tblGrid>${tableRow(["Time", "Activity"])}${tableRow(["10am", "Seed swap"])}${tableRow(["2pm", "Composting talk"])}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>`,
    },
    { shapes: pPic("Picture 2", "Children planting sunflowers in the family bed") + title("Timetable") },
    { shapes: title("A walk round the garden") + pPic("Video 3", "Two-minute tour of the garden", `<a:videoFile r:link="rIdVideo"/>`) },
    { shapes: title("Draft: parking"), hidden: true },
  ]
  const files: Record<string, Uint8Array> = {
    "_rels/.rels": strToU8(packageRels("ppt/presentation.xml")),
    "docProps/core.xml": strToU8(core("PowerPoint Presentation")),
    "ppt/presentation.xml": strToU8(
      `${HEAD}<p:presentation ${P}><p:sldIdLst>${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="en-GB"/></a:defPPr></p:defaultTextStyle></p:presentation>`,
    ),
    "ppt/_rels/presentation.xml.rels": strToU8(rels(slides.map((_, i) => [`rId${i + 1}`, "slide", `slides/slide${i + 1}.xml`]))),
  }
  slides.forEach((s, i) => {
    files[`ppt/slides/slide${i + 1}.xml`] = strToU8(
      `${HEAD}<p:sld ${P}${s.hidden ? ` show="0"` : ""}><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>${s.shapes}</p:spTree></p:cSld></p:sld>`,
    )
    files[`ppt/slides/_rels/slide${i + 1}.xml.rels`] = strToU8(rels([["rIdImg", "image", "../media/image1.jpg"], ["rIdVideo", "video", "https://example.org/tour.mp4", true]]))
  })
  return zipSync(files)
}
