const COLS = 4;
const ROWS = 2;
const SLOTS_PER_PAGE = COLS * ROWS;
const FONT_PT_MIN = 8;
const FONT_PT_MAX = 60;
const CARD_INNER_WIDTH_MM = 64;
const CARD_TEXT_HEIGHT_MM = 44;

const state = {
  project: createDefaultProject(),
  dirty: false,
  editorReady: false,
  mmToPx: null,
  previewTimer: null,
  loadedGoogleFonts: new Set(),
};

const elements = {
  dirtyIndicator: document.getElementById("dirty-indicator"),
  tabs: document.querySelectorAll(".tab"),
  tabText: document.getElementById("tab-text"),
  tabImage: document.getElementById("tab-image"),
  imageInput: document.getElementById("image-input"),
  imageList: document.getElementById("image-list"),
  previewFrame: document.getElementById("preview-frame"),
  measureBox: document.getElementById("measure-box"),
  projectInput: document.getElementById("project-input"),
  newProject: document.getElementById("new-project"),
  loadProject: document.getElementById("load-project"),
  saveProject: document.getElementById("save-project"),
  printProject: document.getElementById("print-project"),
  textColor: document.getElementById("text-color"),
  textShadow: document.getElementById("text-shadow"),
  fontName: document.getElementById("font-name"),
  fontGoogle: document.getElementById("font-google"),
  fontGoogleEnabled: document.getElementById("font-google-enabled"),
  fontSizeMode: document.getElementById("font-size-mode"),
  fontSizeFixed: document.getElementById("font-size-fixed"),
  textAlign: document.getElementById("text-align"),
  textLineHeight: document.getElementById("text-line-height"),
  fontStatus: document.getElementById("font-status"),
  textFitWarning: document.getElementById("text-fit-warning"),
  stylePreset: document.getElementById("style-preset"),
  cardBgMode: document.getElementById("card-bg-mode"),
  cardBgColor: document.getElementById("card-bg-color"),
  cardBgGradientType: document.getElementById("card-bg-gradient-type"),
  cardBgGradientDirection: document.getElementById("card-bg-gradient-direction"),
  cardBgGrad1: document.getElementById("card-bg-grad-1"),
  cardBgGrad2: document.getElementById("card-bg-grad-2"),
  cardBorderEnabled: document.getElementById("card-border-enabled"),
  cardBorderColor: document.getElementById("card-border-color"),
  cardBorderWidth: document.getElementById("card-border-width"),
  cardBorderStyle: document.getElementById("card-border-style"),
  cardLineEnabled: document.getElementById("card-line-enabled"),
  cardLineColor: document.getElementById("card-line-color"),
  cardLineWidth: document.getElementById("card-line-width"),
  cardLineStyle: document.getElementById("card-line-style"),
  cardShadowEnabled: document.getElementById("card-shadow-enabled"),
  cardRoundedEnabled: document.getElementById("card-rounded-enabled"),
  cardRadius: document.getElementById("card-radius"),
  imageRadius: document.getElementById("image-radius"),
  showCutLines: document.getElementById("show-cutlines"),
  bgColorFields: document.querySelectorAll(".field-bg-color"),
  bgGradientFields: document.querySelectorAll(".field-bg-gradient"),
  borderFields: document.querySelectorAll(".field-border"),
  lineFields: document.querySelectorAll(".field-line"),
  fontSystemFields: document.querySelectorAll(".field-font-system"),
  fontGoogleFields: document.querySelectorAll(".field-font-google"),
  settingsTabs: document.querySelectorAll(".settings-tab"),
  settingsPanels: document.querySelectorAll(".settings-tab-content"),
  previewScale: document.getElementById("preview-scale"),
  previewScaleValue: document.getElementById("preview-scale-value"),
  previewFit: document.getElementById("preview-fit"),
  previewViewport: document.querySelector(".preview-viewport"),
};

function createDefaultSettings() {
  return {
    textColorHex: "#000000",
    textShadowEnabled: false,
    fontName: "Times New Roman",
    fontGoogleName: "",
    fontGoogleEnabled: false,
    fontSizePtMode: "auto",
    fontSizePtFixed: 28,
    textAlign: "center",
    textLineHeight: 1.1,
    cardBackgroundMode: "white",
    cardBackgroundColorHex: "#ffffff",
    cardBackgroundGradientType: "linear",
    cardBackgroundGradientDirection: "vertical",
    cardBackgroundGradColor1Hex: "#ffffff",
    cardBackgroundGradColor2Hex: "#e0ecff",
    cardBorderEnabled: true,
    cardBorderColorHex: "#3366cc",
    cardBorderWidthPx: 2,
    cardBorderStyle: "solid",
    cardLineEnabled: true,
    cardLineColorHex: "#3366cc",
    cardLineWidthPx: 2,
    cardLineStyle: "solid",
    cardShadowEnabled: false,
    cardRoundedEnabled: true,
    cardRadiusMm: 4,
    imageRadiusPx: 12,
    showCutLines: false,
  };
}

const STYLE_PRESETS = [
  {
    id: "classic",
    name: "Klasyczny",
    settings: {
      textColorHex: "#000000",
      textShadowEnabled: false,
      cardBackgroundMode: "white",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#ffffff",
      cardBackgroundGradColor2Hex: "#e0ecff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#3366cc",
      cardBorderWidthPx: 2,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#3366cc",
      cardLineWidthPx: 2,
      cardLineStyle: "solid",
      cardShadowEnabled: false,
      cardRoundedEnabled: true,
      cardRadiusMm: 4,
      imageRadiusPx: 12,
      showCutLines: false,
    },
  },
  {
    id: "soft",
    name: "Miękki gradient",
    settings: {
      textColorHex: "#003366",
      textShadowEnabled: false,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#ffffff",
      cardBackgroundGradColor2Hex: "#cce0ff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#6699cc",
      cardBorderWidthPx: 2,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#6699cc",
      cardLineWidthPx: 2,
      cardLineStyle: "solid",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 5,
      imageRadiusPx: 14,
      showCutLines: false,
    },
  },
  {
    id: "outline",
    name: "Obwódka",
    settings: {
      textColorHex: "#111827",
      textShadowEnabled: false,
      cardBackgroundMode: "color",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "horizontal",
      cardBackgroundGradColor1Hex: "#ffffff",
      cardBackgroundGradColor2Hex: "#ffffff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#111827",
      cardBorderWidthPx: 2,
      cardBorderStyle: "dashed",
      cardLineEnabled: true,
      cardLineColorHex: "#111827",
      cardLineWidthPx: 2,
      cardLineStyle: "dotted",
      cardShadowEnabled: false,
      cardRoundedEnabled: false,
      cardRadiusMm: 0,
      imageRadiusPx: 6,
      showCutLines: true,
    },
  },
  {
    id: "pastel",
    name: "Pastelowy",
    settings: {
      textColorHex: "#334455",
      textShadowEnabled: false,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "radial",
      cardBackgroundGradientDirection: "diagonal",
      cardBackgroundGradColor1Hex: "#fff5ff",
      cardBackgroundGradColor2Hex: "#e0f7ff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#ff9999",
      cardBorderWidthPx: 2,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#ff9999",
      cardLineWidthPx: 2,
      cardLineStyle: "solid",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 6,
      imageRadiusPx: 16,
      showCutLines: false,
    },
  },
  {
    id: "retro",
    name: "Retro 80s",
    settings: {
      textColorHex: "#1f1330",
      textShadowEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "diagonal",
      cardBackgroundGradColor1Hex: "#ffe29a",
      cardBackgroundGradColor2Hex: "#ff92b5",
      cardBorderEnabled: true,
      cardBorderColorHex: "#6a0dad",
      cardBorderWidthPx: 3,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#6a0dad",
      cardLineWidthPx: 3,
      cardLineStyle: "solid",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 7,
      imageRadiusPx: 18,
      showCutLines: false,
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    settings: {
      textColorHex: "#f8fafc",
      textShadowEnabled: true,
      cardBackgroundMode: "color",
      cardBackgroundColorHex: "#0f172a",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#0f172a",
      cardBackgroundGradColor2Hex: "#1e293b",
      cardBorderEnabled: true,
      cardBorderColorHex: "#38bdf8",
      cardBorderWidthPx: 2,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#38bdf8",
      cardLineWidthPx: 2,
      cardLineStyle: "dashed",
      cardShadowEnabled: false,
      cardRoundedEnabled: true,
      cardRadiusMm: 4,
      imageRadiusPx: 12,
      showCutLines: false,
    },
  },
];

function createDefaultProject() {
  return {
    version: 1,
    mode: "text",
    textHtml: "",
    images: [],
    settings: createDefaultSettings(),
  };
}

function setDirty(isDirty) {
  state.dirty = isDirty;
  elements.dirtyIndicator.textContent = isDirty ? "● Zmieniono" : "";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function schedulePreview() {
  if (state.previewTimer) {
    clearTimeout(state.previewTimer);
  }
  state.previewTimer = setTimeout(() => {
    renderPreview();
  }, 250);
}

function switchTab(tab) {
  elements.tabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
  elements.tabText.classList.toggle("hidden", tab !== "text");
  elements.tabImage.classList.toggle("hidden", tab !== "image");
  state.project.mode = tab;
  setDirty(true);
  schedulePreview();
}

function updateSettingsFromInputs() {
  const settings = state.project.settings;
  settings.textColorHex = elements.textColor.value;
  settings.textShadowEnabled = elements.textShadow.checked;
  settings.fontGoogleEnabled = elements.fontGoogleEnabled.checked;
  if (settings.fontGoogleEnabled) {
    settings.fontGoogleName = elements.fontGoogle.value.trim();
    settings.fontName = elements.fontName.value.trim() || "Times New Roman";
  } else {
    settings.fontGoogleName = "";
    settings.fontName = elements.fontName.value.trim() || "Times New Roman";
  }
  settings.fontSizePtMode = elements.fontSizeMode.value;
  settings.fontSizePtFixed = clamp(Number(elements.fontSizeFixed.value) || 28, 8, 72);
  settings.textAlign = elements.textAlign.value;
  settings.textLineHeight = clamp(Number(elements.textLineHeight.value) || 1.1, 1, 1.6);
  settings.cardBackgroundMode = elements.cardBgMode.value;
  settings.cardBackgroundColorHex = elements.cardBgColor.value;
  settings.cardBackgroundGradientType = elements.cardBgGradientType.value;
  settings.cardBackgroundGradientDirection = elements.cardBgGradientDirection.value;
  settings.cardBackgroundGradColor1Hex = elements.cardBgGrad1.value;
  settings.cardBackgroundGradColor2Hex = elements.cardBgGrad2.value;
  settings.cardBorderEnabled = elements.cardBorderEnabled.checked;
  settings.cardBorderColorHex = elements.cardBorderColor.value;
  settings.cardBorderWidthPx = clamp(Number(elements.cardBorderWidth.value) || 0, 0, 12);
  settings.cardBorderStyle = elements.cardBorderStyle.value;
  settings.cardLineEnabled = elements.cardLineEnabled.checked;
  settings.cardLineColorHex = elements.cardLineColor.value;
  settings.cardLineWidthPx = clamp(Number(elements.cardLineWidth.value) || 0, 0, 12);
  settings.cardLineStyle = elements.cardLineStyle.value;
  settings.cardShadowEnabled = elements.cardShadowEnabled.checked;
  settings.cardRoundedEnabled = elements.cardRoundedEnabled.checked;
  settings.cardRadiusMm = clamp(Number(elements.cardRadius.value) || 0, 0, 10);
  settings.imageRadiusPx = clamp(Number(elements.imageRadius.value) || 0, 0, 30);
  settings.showCutLines = elements.showCutLines.checked;
}

function applySettingsToInputs() {
  const settings = state.project.settings;
  elements.textColor.value = settings.textColorHex;
  elements.textShadow.checked = settings.textShadowEnabled;
  elements.fontName.value = settings.fontName;
  elements.fontGoogle.value = settings.fontGoogleName || "";
  elements.fontGoogleEnabled.checked = settings.fontGoogleEnabled;
  elements.fontSizeMode.value = settings.fontSizePtMode;
  elements.fontSizeFixed.value = settings.fontSizePtFixed;
  elements.textAlign.value = settings.textAlign;
  elements.textLineHeight.value = settings.textLineHeight;
  elements.cardBgMode.value = settings.cardBackgroundMode;
  elements.cardBgColor.value = settings.cardBackgroundColorHex;
  elements.cardBgGradientType.value = settings.cardBackgroundGradientType;
  elements.cardBgGradientDirection.value = settings.cardBackgroundGradientDirection;
  elements.cardBgGrad1.value = settings.cardBackgroundGradColor1Hex;
  elements.cardBgGrad2.value = settings.cardBackgroundGradColor2Hex;
  elements.cardBorderEnabled.checked = settings.cardBorderEnabled;
  elements.cardBorderColor.value = settings.cardBorderColorHex;
  elements.cardBorderWidth.value = settings.cardBorderWidthPx;
  elements.cardBorderStyle.value = settings.cardBorderStyle;
  elements.cardLineEnabled.checked = settings.cardLineEnabled;
  elements.cardLineColor.value = settings.cardLineColorHex;
  elements.cardLineWidth.value = settings.cardLineWidthPx;
  elements.cardLineStyle.value = settings.cardLineStyle;
  elements.cardShadowEnabled.checked = settings.cardShadowEnabled;
  elements.cardRoundedEnabled.checked = settings.cardRoundedEnabled;
  elements.cardRadius.value = settings.cardRadiusMm;
  elements.imageRadius.value = settings.imageRadiusPx;
  elements.showCutLines.checked = settings.showCutLines;
  updateFontSizeModeUI();
  updateFontStatus("");
  updateTextFitWarning("");
  syncConditionalFields();
}

function bindSettingsEvents() {
  const inputs = document.querySelectorAll(
    "#text-color, #text-shadow, #font-name, #font-google, #font-size-mode, #font-size-fixed, #text-align, #text-line-height, #card-bg-mode, #card-bg-color, #card-bg-gradient-type, #card-bg-gradient-direction, #card-bg-grad-1, #card-bg-grad-2, #card-border-enabled, #card-border-color, #card-border-width, #card-border-style, #card-line-enabled, #card-line-color, #card-line-width, #card-line-style, #card-shadow-enabled, #card-rounded-enabled, #card-radius, #image-radius, #show-cutlines"
  );

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateSettingsFromInputs();
      syncConditionalFields();
      setDirty(true);
      schedulePreview();
    });
  });
}

function updateFontSizeModeUI() {
  const isAuto = elements.fontSizeMode.value === "auto";
  elements.fontSizeFixed.disabled = isAuto;
}

function updateFontStatus(message) {
  elements.fontStatus.textContent = message;
}

function updateTextFitWarning(message) {
  elements.textFitWarning.textContent = message;
}

function toggleFields(fields, isVisible) {
  fields.forEach((field) => {
    field.classList.toggle("is-hidden", !isVisible);
  });
}

function toggleDisabled(fields, isDisabled) {
  fields.forEach((field) => {
    field.classList.toggle("field-disabled", isDisabled);
  });
}

function syncConditionalFields() {
  const settings = state.project.settings;
  const bgMode = settings.cardBackgroundMode;
  toggleFields(elements.bgColorFields, bgMode === "color");
  toggleFields(elements.bgGradientFields, bgMode === "gradient");

  toggleDisabled(elements.borderFields, !settings.cardBorderEnabled);
  toggleDisabled(elements.lineFields, !settings.cardLineEnabled);

  const googleEnabled = settings.fontGoogleEnabled;
  toggleFields(elements.fontGoogleFields, googleEnabled);
  toggleFields(elements.fontSystemFields, !googleEnabled);
}

async function loadGoogleFont(name) {
  if (!name) {
    return false;
  }
  if (state.loadedGoogleFonts.has(name)) {
    return true;
  }
  const urlName = name.trim().replace(/\s+/g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(urlName)}:wght@400;700&display=swap`;
  const response = await fetch(href);
  if (!response.ok) {
    return false;
  }
  const cssText = await response.text();
  if (!cssText.includes("@font-face")) {
    return false;
  }
  let link = document.getElementById("google-font-link");
  if (!link) {
    link = document.createElement("link");
    link.id = "google-font-link";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = href;
  await document.fonts.load(`1em "${name}"`);
  state.loadedGoogleFonts.add(name);
  return true;
}

function setupTabs() {
  elements.tabs.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });
}

function setupSettingsTabs() {
  elements.settingsTabs.forEach((button) => {
    button.addEventListener("click", () => {
      elements.settingsTabs.forEach((tab) =>
        tab.classList.toggle("active", tab.dataset.settingsTab === button.dataset.settingsTab)
      );
      elements.settingsPanels.forEach((panel) =>
        panel.classList.toggle(
          "hidden",
          panel.dataset.settingsPanel !== button.dataset.settingsTab
        )
      );
    });
  });
}

function setupEditor() {
  tinymce.init({
    selector: "#text-editor",
    menubar: false,
    statusbar: false,
    branding: false,
    height: 260,
    plugins: "lists",
    toolbar: "bold italic underline | bullist numlist | removeformat",
    newline_behavior: "linebreak",
    setup: (editor) => {
      editor.on("init", () => {
        editor.setContent(state.project.textHtml || "");
        state.editorReady = true;
        schedulePreview();
      });
      editor.on("input change keyup", () => {
        state.project.textHtml = editor.getContent({ format: "html" });
        setDirty(true);
        schedulePreview();
      });
    },
  });
}

function normalizeHtmlToItems(html) {
  if (!html) {
    return [];
  }
  let normalized = html
    .replace(/\n/g, "")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "<br>")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "<br>");

  const parts = normalized.split(/<br\s*\/?\s*>/i);
  return parts
    .map((part) => part.trim())
    .filter((part) => stripHtml(part).replace(/&nbsp;/g, " ").trim().length > 0);
}

function prepareItemsForFit(itemsHtml) {
  return itemsHtml.map((item) => `${item}<span>&nbsp;?</span>`);
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function computeMmToPx() {
  const test = document.createElement("div");
  test.style.width = "100mm";
  test.style.position = "absolute";
  test.style.visibility = "hidden";
  document.body.appendChild(test);
  const px = test.offsetWidth / 100;
  document.body.removeChild(test);
  return px;
}

function computeAutoFontPt(itemsHtml, settings) {
  if (!itemsHtml.length) {
    return 28;
  }

  const fitItems = prepareItemsForFit(itemsHtml);
  const measure = elements.measureBox;
  if (!state.mmToPx) {
    state.mmToPx = computeMmToPx();
  }

  const width = CARD_INNER_WIDTH_MM * state.mmToPx * 0.95;
  const height = CARD_TEXT_HEIGHT_MM * state.mmToPx * 0.9;

  measure.style.width = `${width}px`;
  measure.style.height = `${height}px`;
  measure.style.padding = "0";
  measure.style.fontFamily = settings.fontName;
  measure.style.fontSize = "28pt";
  measure.style.lineHeight = settings.textLineHeight.toString();
  measure.style.wordWrap = "break-word";
  measure.style.overflow = "hidden";
  measure.style.display = "block";
  measure.style.textAlign = settings.textAlign;

  const fits = (fontPt) => {
    measure.style.fontSize = `${fontPt}pt`;
    for (const item of fitItems) {
      measure.innerHTML = `<div class="measure-header" style="margin-bottom:2mm;">Ja mam</div><div class="measure-word">${item}</div>`;
      if (measure.scrollWidth > measure.clientWidth || measure.scrollHeight > measure.clientHeight) {
        return false;
      }
    }
    return true;
  };

  let low = FONT_PT_MIN;
  let high = FONT_PT_MAX;
  let best = FONT_PT_MIN;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (fits(mid)) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}

function checkTextFits(itemsHtml, settings, fontPt) {
  if (!itemsHtml.length) {
    return true;
  }
  const fitItems = prepareItemsForFit(itemsHtml);
  const measure = elements.measureBox;
  if (!state.mmToPx) {
    state.mmToPx = computeMmToPx();
  }

  const width = CARD_INNER_WIDTH_MM * state.mmToPx * 0.95;
  const height = CARD_TEXT_HEIGHT_MM * state.mmToPx * 0.9;
  measure.style.width = `${width}px`;
  measure.style.height = `${height}px`;
  measure.style.padding = "0";
  const fontFamily =
    settings.fontGoogleEnabled && settings.fontGoogleName && state.loadedGoogleFonts.has(settings.fontGoogleName)
      ? `"${settings.fontGoogleName}", "${settings.fontName}", serif`
      : `"${settings.fontName}", serif`;
  measure.style.fontFamily = fontFamily;
  measure.style.fontSize = `${fontPt}pt`;
  measure.style.lineHeight = settings.textLineHeight.toString();
  measure.style.wordWrap = "break-word";
  measure.style.overflow = "hidden";
  measure.style.display = "block";
  measure.style.textAlign = settings.textAlign;

  for (const item of fitItems) {
    measure.innerHTML = `<div class="measure-header" style="margin-bottom:2mm;">Ja mam</div><div class="measure-word">${item}</div>`;
    if (measure.scrollWidth > measure.clientWidth || measure.scrollHeight > measure.clientHeight) {
      return false;
    }
  }
  return true;
}

function buildCss(settings, fontPt) {
  const hasGoogleFont =
    settings.fontGoogleEnabled &&
    settings.fontGoogleName &&
    state.loadedGoogleFonts.has(settings.fontGoogleName);
  const fontFamily = hasGoogleFont
    ? `"${settings.fontGoogleName}", "${settings.fontName}", serif`
    : `"${settings.fontName}", serif`;
  const textShadowCss = settings.textShadowEnabled
    ? "text-shadow: 0 0.4mm 0.8mm rgba(0,0,0,0.35);"
    : "text-shadow: none;";

  let borderCss = "border: none;";
  if (settings.cardBorderEnabled && settings.cardBorderWidthPx > 0) {
    borderCss = `border: ${settings.cardBorderWidthPx}px ${settings.cardBorderStyle} ${settings.cardBorderColorHex};`;
  }

  let lineCss = "border-top: none;";
  let lineDisplay = "display: none;";
  if (settings.cardLineEnabled && settings.cardLineWidthPx > 0) {
    lineCss = `border-top: ${settings.cardLineWidthPx}px ${settings.cardLineStyle} ${settings.cardLineColorHex};`;
    lineDisplay = "display: block;";
  }

  let bgCss = "background: #ffffff;";
  if (settings.cardBackgroundMode === "color") {
    bgCss = `background: ${settings.cardBackgroundColorHex};`;
  }
  if (settings.cardBackgroundMode === "gradient") {
    if (settings.cardBackgroundGradientType === "radial") {
      bgCss = `background: radial-gradient(circle, ${settings.cardBackgroundGradColor1Hex}, ${settings.cardBackgroundGradColor2Hex});`;
    } else {
      const angle =
        settings.cardBackgroundGradientDirection === "vertical"
          ? "180deg"
          : settings.cardBackgroundGradientDirection === "horizontal"
          ? "90deg"
          : "135deg";
      bgCss = `background: linear-gradient(${angle}, ${settings.cardBackgroundGradColor1Hex}, ${settings.cardBackgroundGradColor2Hex});`;
    }
  }

  const shadowCss = settings.cardShadowEnabled
    ? "box-shadow: 0 2mm 4mm rgba(0,0,0,0.18);"
    : "box-shadow: none;";

  const radiusValue = settings.cardRoundedEnabled ? settings.cardRadiusMm : 0;
  const radiusCss = settings.cardRoundedEnabled
    ? `border-radius: ${radiusValue}mm; overflow: hidden;`
    : "border-radius: 0; overflow: visible;";

  let css = `
@page {
  size: A4 landscape;
  margin: 0;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  font-family: ${fontFamily};
  background: #ffffff;
}

.page {
  box-sizing: border-box;
  width: 297mm;
  height: 210mm;
  margin: 0 auto;
  background: white;
  display: block;
  position: relative;
  page-break-after: always;
}

@media screen {
  body {
    background: #d0d0d0;
  }

  .page {
    margin: 6mm auto 8mm auto;
    box-shadow: 0 0 4mm rgba(0,0,0,0.25);
  }
}

.page-table {
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  table-layout: fixed;
}

.page-table tr {
  height: 50%;
}

.page-table td {
  width: 25%;
  padding: 0;
  margin: 0;
  vertical-align: top;
}

.card {
  box-sizing: border-box;
  padding: 4mm;
  margin: 1.5mm;
  position: relative;
  width: calc(100% - 3mm);
  height: calc(100% - 3mm);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  ${borderCss}
  ${bgCss}
  ${shadowCss}
  ${radiusCss}
}

.card-line {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 50%;
  ${lineCss}
  ${lineDisplay}
  z-index: 10;
  pointer-events: none;
}

.half {
  position: absolute;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding: 3mm;
}

.half.top {
  top: 0;
  bottom: 50%;
}

.half.bottom {
  top: 50%;
  bottom: 0;
}

.half-content {
  display: table;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.half-content-inner {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  overflow: hidden;
}

.text-card .header,
.text-card .word {
  font-size: ${fontPt}pt;
  line-height: ${settings.textLineHeight};
  word-wrap: break-word;
  color: ${settings.textColorHex};
  text-align: ${settings.textAlign};
  ${textShadowCss}
}

.text-card .header {
  margin-bottom: 2mm;
  text-align: ${settings.textAlign};
}

.text-card .word {
  max-height: 100%;
  overflow: hidden;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.image-card .header {
  font-size: 28pt;
  margin-bottom: 2mm;
  color: ${settings.textColorHex};
  text-align: ${settings.textAlign};
  display: block;
  width: 100%;
  ${textShadowCss}
}

.image-card .half-content {
  width: 100%;
  height: 100%;
  display: block;
}

.image-card .half-content-inner {
  width: 100%;
  height: 100%;
  text-align: center;
  display: block;
}

.image-card .img-box {
  display: block;
  margin: 0 auto;
  width: 100%;
  height: calc(100% - 7mm);
  box-sizing: border-box;
  padding: 1mm;
  overflow: hidden;
  border-radius: ${settings.imageRadiusPx}px;
}

.image-card img {
  display: inline-block;
  border-radius: ${settings.imageRadiusPx}px;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
`;

  if (settings.showCutLines) {
    css += `
.cutlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
}

.cutline-h {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  border-top: 1px dashed #999;
}

.cutline-v {
  position: absolute;
  top: 0;
  height: 100%;
  border-left: 1px dashed #999;
}

.cutline-v.x1 { left: 25%; }
.cutline-v.x2 { left: 50%; }
.cutline-v.x3 { left: 75%; }
`;
  }

  return css;
}

function buildFullHtml(css, body) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Karty</title>
  <style>${css}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function buildTextCard(topHtml, bottomHtml) {
  return `<td>
  <div class="card text-card">
    <div class="card-inner">
      <div class="card-line"></div>
      <div class="half top">
        <div class="half-content">
          <div class="half-content-inner">
            <div class="header">Ja mam</div>
            <div class="word">${topHtml}</div>
          </div>
        </div>
      </div>
      <div class="half bottom">
        <div class="half-content">
          <div class="half-content-inner">
            <div class="header">Kto ma</div>
            <div class="word">${bottomHtml}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</td>`;
}

function buildImageCard(topSrc, bottomSrc) {
  return `<td>
  <div class="card image-card">
    <div class="card-inner">
      <div class="card-line"></div>
      <div class="half top">
        <div class="half-content">
          <div class="half-content-inner">
            <div class="header">Ja mam</div>
            <div class="img-box">
              <img src="${topSrc}" />
            </div>
          </div>
        </div>
      </div>
      <div class="half bottom">
        <div class="half-content">
          <div class="half-content-inner">
            <div class="header">Kto ma?</div>
            <div class="img-box">
              <img src="${bottomSrc}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</td>`;
}

function buildPage(cardsHtml, showCutLines) {
  const cutlines = showCutLines
    ? `<div class="cutlines">
    <div class="cutline-h"></div>
    <div class="cutline-v x1"></div>
    <div class="cutline-v x2"></div>
    <div class="cutline-v x3"></div>
  </div>`
    : "";

  return `<div class="page">${cutlines}
  <table class="page-table">
    ${cardsHtml}
  </table>
</div>`;
}

function buildTextPages(itemsHtml, settings) {
  const pages = [];
  const n = itemsHtml.length;
  const pageCount = Math.ceil(n / SLOTS_PER_PAGE);

  for (let p = 0; p < pageCount; p += 1) {
    const start = p * SLOTS_PER_PAGE;
    const rows = [];
    for (let row = 0; row < ROWS; row += 1) {
      const cells = [];
      for (let col = 0; col < COLS; col += 1) {
        const idx = start + row * COLS + col;
        if (idx >= n) {
          cells.push("<td></td>");
          continue;
        }
        const top = itemsHtml[idx];
        const bottomIndex = (idx + 1) % n;
        const bottom = `${itemsHtml[bottomIndex]}<span>&nbsp;?</span>`;
        cells.push(buildTextCard(top, bottom));
      }
      rows.push(`<tr>${cells.join("")}</tr>`);
    }
    pages.push(buildPage(rows.join(""), settings.showCutLines));
  }
  return pages.join("");
}

function buildImagePages(images, settings) {
  const pages = [];
  const n = images.length;
  const pageCount = Math.ceil(n / SLOTS_PER_PAGE);

  for (let p = 0; p < pageCount; p += 1) {
    const start = p * SLOTS_PER_PAGE;
    const rows = [];
    for (let row = 0; row < ROWS; row += 1) {
      const cells = [];
      for (let col = 0; col < COLS; col += 1) {
        const idx = start + row * COLS + col;
        if (idx >= n) {
          cells.push("<td></td>");
          continue;
        }
        const top = images[idx].dataUrl;
        const bottom = images[(idx + 1) % n].dataUrl;
        cells.push(buildImageCard(top, bottom));
      }
      rows.push(`<tr>${cells.join("")}</tr>`);
    }
    pages.push(buildPage(rows.join(""), settings.showCutLines));
  }
  return pages.join("");
}

function renderPreview() {
  const settings = state.project.settings;
  let body = "";
  let fontPt = settings.fontSizePtFixed;

  if (state.project.mode === "text") {
    const editor = tinymce.get("text-editor");
    if (editor) {
      state.project.textHtml = editor.getContent({ format: "html" });
    }
    const items = normalizeHtmlToItems(state.project.textHtml);
    if (settings.fontSizePtMode === "auto") {
      fontPt = computeAutoFontPt(items, settings);
      updateTextFitWarning("");
    } else {
      const fits = checkTextFits(items, settings, fontPt);
      updateTextFitWarning(
        fits ? "" : "Uwaga: tekst nie mieści się w polu karty przy stałej czcionce."
      );
    }
    body = items.length
      ? buildTextPages(items, settings)
      : "<p style=\"padding:12px;\">Brak elementów do wygenerowania.</p>";
  } else {
    const images = state.project.images;
    body = images.length
      ? buildImagePages(images, settings)
      : "<p style=\"padding:12px;\">Brak obrazków do wygenerowania.</p>";
  }

  const css = buildCss(settings, fontPt);
  const html = buildFullHtml(css, body);
  elements.previewFrame.srcdoc = html;
}

function applyPreviewScale(scaleValue) {
  const scale = clamp(Number(scaleValue) || 100, 60, 140) / 100;
  elements.previewScaleValue.textContent = `${Math.round(scale * 100)}%`;
  elements.previewFrame.style.transform = `scale(${scale})`;
  elements.previewFrame.style.width = `${100 / scale}%`;
  elements.previewFrame.style.height = `${100 / scale}%`;
}

function fitPreviewToWidth() {
  if (!state.mmToPx) {
    state.mmToPx = computeMmToPx();
  }
  const pageWidthPx = 297 * state.mmToPx;
  const viewportWidth = elements.previewViewport.clientWidth - 24;
  const scale = clamp((viewportWidth / pageWidthPx) * 100, 60, 140);
  elements.previewScale.value = Math.round(scale);
  applyPreviewScale(scale);
}

function renderImageList() {
  elements.imageList.innerHTML = "";
  state.project.images.forEach((image, index) => {
    const item = document.createElement("div");
    item.className = "image-item";

    const preview = document.createElement("img");
    preview.src = image.dataUrl;
    preview.alt = image.name;

    const name = document.createElement("span");
    name.textContent = image.name;

    const actions = document.createElement("div");
    actions.className = "image-actions";

    const up = document.createElement("button");
    up.type = "button";
    up.textContent = "↑";
    up.disabled = index === 0;
    up.addEventListener("click", () => moveImage(index, -1));

    const down = document.createElement("button");
    down.type = "button";
    down.textContent = "↓";
    down.disabled = index === state.project.images.length - 1;
    down.addEventListener("click", () => moveImage(index, 1));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Usuń";
    remove.addEventListener("click", () => removeImage(index));

    actions.append(up, down, remove);
    item.append(preview, name, actions);
    elements.imageList.appendChild(item);
  });
}

function moveImage(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= state.project.images.length) {
    return;
  }
  const images = state.project.images;
  const [moved] = images.splice(index, 1);
  images.splice(newIndex, 0, moved);
  setDirty(true);
  renderImageList();
  schedulePreview();
}

function removeImage(index) {
  state.project.images.splice(index, 1);
  setDirty(true);
  renderImageList();
  schedulePreview();
}

function addImages(files) {
  const promises = Array.from(files).map(
    (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          state.project.images.push({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl: reader.result,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      })
  );

  Promise.all(promises).then(() => {
    setDirty(true);
    renderImageList();
    schedulePreview();
  });
}

function confirmIfDirty(message) {
  if (!state.dirty) {
    return true;
  }
  return window.confirm(message);
}

function handleNewProject() {
  if (!confirmIfDirty("Projekt ma niezapisane zmiany. Na pewno utworzyć nowy?")) {
    return;
  }
  state.project = createDefaultProject();
  applySettingsToInputs();
  elements.stylePreset.value = "custom";
  renderImageList();
  if (state.editorReady) {
    const editor = tinymce.get("text-editor");
    if (editor) {
      editor.setContent("");
    }
  }
  switchTab(state.project.mode);
  setDirty(false);
  schedulePreview();
}

function handleSaveProject() {
  if (state.project.mode === "text") {
    const editor = tinymce.get("text-editor");
    if (editor) {
      state.project.textHtml = editor.getContent({ format: "html" });
    }
  }
  const blob = new Blob([JSON.stringify(state.project, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "projekt_kart.json";
  link.click();
  URL.revokeObjectURL(url);
  setDirty(false);
}

function handleLoadProject(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || data.version !== 1) {
        throw new Error("Nieobsługiwany format projektu.");
      }
      state.project = {
        version: 1,
        mode: data.mode === "image" ? "image" : "text",
        textHtml: data.textHtml || "",
        images: Array.isArray(data.images) ? data.images : [],
        settings: { ...createDefaultSettings(), ...data.settings },
      };
      applySettingsToInputs();
      elements.stylePreset.value = "custom";
      renderImageList();
      if (state.editorReady) {
        const editor = tinymce.get("text-editor");
        if (editor) {
          editor.setContent(state.project.textHtml || "");
        }
      }
      switchTab(state.project.mode);
      setDirty(false);
      if (state.project.settings.fontGoogleEnabled && state.project.settings.fontGoogleName) {
        loadGoogleFont(state.project.settings.fontGoogleName).then((loaded) => {
          updateFontStatus(
            loaded
              ? `Wczytano Google Font: ${state.project.settings.fontGoogleName}`
              : `Nie znaleziono Google Font: ${state.project.settings.fontGoogleName}`
          );
          schedulePreview();
        });
      }
      schedulePreview();
    } catch (error) {
      window.alert(`Nie udało się wczytać projektu: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function handlePrint() {
  renderPreview();
  const settings = state.project.settings;
  let body = "";
  let fontPt = settings.fontSizePtFixed;

  if (state.project.mode === "text") {
    const items = normalizeHtmlToItems(state.project.textHtml);
    if (settings.fontSizePtMode === "auto") {
      fontPt = computeAutoFontPt(items, settings);
    }
    body = items.length
      ? buildTextPages(items, settings)
      : "<p style=\"padding:12px;\">Brak elementów do wydruku.</p>";
  } else {
    const images = state.project.images;
    body = images.length
      ? buildImagePages(images, settings)
      : "<p style=\"padding:12px;\">Brak obrazków do wydruku.</p>";
  }

  const css = buildCss(settings, fontPt);
  const html = buildFullHtml(css, body);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.alert("Nie udało się otworzyć okna drukowania. Sprawdź blokadę popupów.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
  };
}

function setupProjectControls() {
  elements.newProject.addEventListener("click", handleNewProject);
  elements.saveProject.addEventListener("click", handleSaveProject);
  elements.loadProject.addEventListener("click", () => {
    if (!confirmIfDirty("Projekt ma niezapisane zmiany. Na pewno wczytać nowy?")) {
      return;
    }
    elements.projectInput.value = "";
    elements.projectInput.click();
  });
  elements.projectInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      handleLoadProject(file);
    }
  });
  elements.printProject.addEventListener("click", handlePrint);
}

function setupImageControls() {
  elements.imageInput.addEventListener("change", (event) => {
    if (event.target.files.length) {
      addImages(event.target.files);
      event.target.value = "";
    }
  });
}

function setupFontControls() {
  elements.fontSizeMode.addEventListener("change", () => {
    updateFontSizeModeUI();
    syncConditionalFields();
  });

  elements.fontName.addEventListener("change", () => {
    updateFontStatus("Używana czcionka systemowa.");
    schedulePreview();
  });

  elements.fontGoogleEnabled.addEventListener("change", () => {
    updateSettingsFromInputs();
    syncConditionalFields();
    if (!state.project.settings.fontGoogleEnabled) {
      updateFontStatus("Używana czcionka systemowa.");
      schedulePreview();
      return;
    }
    if (state.project.settings.fontGoogleName) {
      updateFontStatus("Sprawdzam Google Fonts...");
      loadGoogleFont(state.project.settings.fontGoogleName).then((loaded) => {
        updateFontStatus(
          loaded
            ? `Wczytano Google Font: ${state.project.settings.fontGoogleName}`
            : `Nie znaleziono Google Font: ${state.project.settings.fontGoogleName}`
        );
        schedulePreview();
      });
    }
  });

  elements.fontGoogle.addEventListener("change", async () => {
    updateSettingsFromInputs();
    if (!state.project.settings.fontGoogleEnabled) {
      updateFontStatus("Używana czcionka systemowa.");
      schedulePreview();
      return;
    }
    if (!state.project.settings.fontGoogleName) {
      updateFontStatus("Używana czcionka systemowa.");
      schedulePreview();
      return;
    }
    updateFontStatus("Sprawdzam Google Fonts...");
    const loaded = await loadGoogleFont(state.project.settings.fontGoogleName);
    updateFontStatus(
      loaded
        ? `Wczytano Google Font: ${state.project.settings.fontGoogleName}`
        : `Nie znaleziono Google Font: ${state.project.settings.fontGoogleName}`
    );
    schedulePreview();
  });
}

function setupStylePresets() {
  elements.stylePreset.innerHTML = "";
  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "Własny";
  elements.stylePreset.appendChild(customOption);
  STYLE_PRESETS.forEach((preset) => {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = preset.name;
    elements.stylePreset.appendChild(option);
  });
  elements.stylePreset.addEventListener("change", () => {
    const preset = STYLE_PRESETS.find((item) => item.id === elements.stylePreset.value);
    if (!preset) {
      return;
    }
  state.project.settings = {
    ...state.project.settings,
    ...preset.settings,
  };
  state.project.settings.fontGoogleEnabled = false;
  state.project.settings.fontGoogleName = "";
  applySettingsToInputs();
  syncConditionalFields();
  setDirty(true);
  schedulePreview();
  });
  elements.stylePreset.value = "custom";
}

function setupPreviewControls() {
  applyPreviewScale(elements.previewScale.value);
  elements.previewScale.addEventListener("input", (event) => {
    applyPreviewScale(event.target.value);
  });
  elements.previewFit.addEventListener("click", () => {
    fitPreviewToWidth();
  });
  window.addEventListener("resize", () => {
    fitPreviewToWidth();
  });
}

function init() {
  applySettingsToInputs();
  bindSettingsEvents();
  setupTabs();
  setupSettingsTabs();
  setupEditor();
  setupImageControls();
  setupFontControls();
  setupStylePresets();
  setupPreviewControls();
  setupProjectControls();
  renderImageList();
  syncConditionalFields();
  if (state.project.settings.fontGoogleEnabled && state.project.settings.fontGoogleName) {
    loadGoogleFont(state.project.settings.fontGoogleName).then((loaded) => {
      updateFontStatus(
        loaded
          ? `Wczytano Google Font: ${state.project.settings.fontGoogleName}`
          : `Nie znaleziono Google Font: ${state.project.settings.fontGoogleName}`
      );
      schedulePreview();
    });
  } else {
    updateFontStatus("Używana czcionka systemowa.");
  }
  schedulePreview();
}

init();
