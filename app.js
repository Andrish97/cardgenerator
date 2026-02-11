const COLS = 4;
const ROWS = 2;
const SLOTS_PER_PAGE = COLS * ROWS;
const FONT_PT_MIN = 8;
const FONT_PT_MAX = 60;
const CARD_INNER_WIDTH_MM = 64;
const CARD_TEXT_HEIGHT_MM = 44;
const THEME_STORAGE_KEY = "cardgenerator-theme";
const PREVIEW_SCALE_MIN = 50;
const PREVIEW_SCALE_MAX = 180;

const state = {
  project: createDefaultProject(),
  dirty: false,
  editorReady: false,
  mmToPx: null,
  previewTimer: null,
  loadedGoogleFonts: new Set(),
  previewBaseWidth: null,
  previewBaseHeight: null,
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
  imageRoundedEnabled: document.getElementById("image-rounded-enabled"),
  imageRadius: document.getElementById("image-radius"),
  imageShadowEnabled: document.getElementById("image-shadow-enabled"),
  showCutLines: document.getElementById("show-cutlines"),
  bgColorFields: document.querySelectorAll(".field-bg-color"),
  bgGradientFields: document.querySelectorAll(".field-bg-gradient"),
  borderFields: document.querySelectorAll(".field-border"),
  lineFields: document.querySelectorAll(".field-line"),
  cardRadiusFields: document.querySelectorAll(".field-card-radius"),
  imageRadiusFields: document.querySelectorAll(".field-image-radius"),
  imageOnlyFields: document.querySelectorAll(".field-image-only"),
  fontSystemFields: document.querySelectorAll(".field-font-system"),
  fontGoogleFields: document.querySelectorAll(".field-font-google"),
  settingsTabs: document.querySelectorAll(".settings-tab"),
  settingsPanels: document.querySelectorAll(".settings-tab-content"),
  previewScale: document.getElementById("preview-scale"),
  previewScaleValue: document.getElementById("preview-scale-value"),
  previewFit: document.getElementById("preview-fit"),
  previewViewport: document.querySelector(".preview-viewport"),
  previewPanel: document.querySelector(".preview"),
  mobilePreviewToggle: document.getElementById("mobile-preview-toggle"),
  themeToggle: document.getElementById("theme-toggle"),
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
    cardBackgroundMode: "white",
    cardBackgroundColorHex: "#ffffff",
    cardBackgroundGradientType: "linear",
    cardBackgroundGradientDirection: "vertical",
    cardBackgroundGradColor1Hex: "#ffffff",
    cardBackgroundGradColor2Hex: "#e0ecff",
    cardBorderEnabled: true,
    cardBorderColorHex: "#3366cc",
    cardBorderWidthMm: 0.6,
    cardBorderStyle: "solid",
    cardLineEnabled: true,
    cardLineColorHex: "#3366cc",
    cardLineWidthMm: 0.6,
    cardLineStyle: "solid",
    cardShadowEnabled: false,
    cardRoundedEnabled: true,
    cardRadiusMm: 4,
    imageRoundedEnabled: true,
    imageRadiusMm: 3,
    imageShadowEnabled: false,
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
      fontName: "Times New Roman",
      fontGoogleName: "",
      fontGoogleEnabled: false,
      cardBackgroundMode: "white",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#ffffff",
      cardBackgroundGradColor2Hex: "#e0ecff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#3366cc",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#3366cc",
      cardLineWidthMm: 0.6,
      cardLineStyle: "solid",
      cardShadowEnabled: false,
      cardRoundedEnabled: true,
      cardRadiusMm: 4,
      imageRoundedEnabled: true,
      imageRadiusMm: 3,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "soft",
    name: "Miękki gradient",
    settings: {
      textColorHex: "#003366",
      textShadowEnabled: false,
      fontName: "Georgia",
      fontGoogleName: "",
      fontGoogleEnabled: false,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#ffffff",
      cardBackgroundGradColor2Hex: "#cce0ff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#6699cc",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#6699cc",
      cardLineWidthMm: 0.6,
      cardLineStyle: "solid",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 5,
      imageRoundedEnabled: true,
      imageRadiusMm: 3.5,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "outline",
    name: "Obwódka",
    settings: {
      textColorHex: "#111827",
      textShadowEnabled: false,
      fontName: "Courier New",
      fontGoogleName: "",
      fontGoogleEnabled: false,
      cardBackgroundMode: "color",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "horizontal",
      cardBackgroundGradColor1Hex: "#ffffff",
      cardBackgroundGradColor2Hex: "#ffffff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#111827",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "dashed",
      cardLineEnabled: true,
      cardLineColorHex: "#111827",
      cardLineWidthMm: 0.6,
      cardLineStyle: "dotted",
      cardShadowEnabled: false,
      cardRoundedEnabled: false,
      cardRadiusMm: 0,
      imageRoundedEnabled: true,
      imageRadiusMm: 1.5,
      imageShadowEnabled: false,
      showCutLines: true,
    },
  },
  {
    id: "pastel",
    name: "Pastelowy",
    settings: {
      textColorHex: "#334455",
      textShadowEnabled: false,
      fontName: "Verdana",
      fontGoogleName: "Quicksand",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "radial",
      cardBackgroundGradientDirection: "diagonal",
      cardBackgroundGradColor1Hex: "#fff5ff",
      cardBackgroundGradColor2Hex: "#e0f7ff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#ff9999",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#ff9999",
      cardLineWidthMm: 0.6,
      cardLineStyle: "solid",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 6,
      imageRoundedEnabled: true,
      imageRadiusMm: 4,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "retro",
    name: "Retro 80s",
    settings: {
      textColorHex: "#1f1330",
      textShadowEnabled: true,
      fontName: "Tahoma",
      fontGoogleName: "Fredoka",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "diagonal",
      cardBackgroundGradColor1Hex: "#ffe29a",
      cardBackgroundGradColor2Hex: "#ff92b5",
      cardBorderEnabled: true,
      cardBorderColorHex: "#6a0dad",
      cardBorderWidthMm: 0.8,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#6a0dad",
      cardLineWidthMm: 0.8,
      cardLineStyle: "solid",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 7,
      imageRoundedEnabled: true,
      imageRadiusMm: 4.5,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    settings: {
      textColorHex: "#f8fafc",
      textShadowEnabled: true,
      fontName: "Arial",
      fontGoogleName: "Poppins",
      fontGoogleEnabled: true,
      cardBackgroundMode: "color",
      cardBackgroundColorHex: "#0f172a",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#0f172a",
      cardBackgroundGradColor2Hex: "#1e293b",
      cardBorderEnabled: true,
      cardBorderColorHex: "#38bdf8",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#38bdf8",
      cardLineWidthMm: 0.6,
      cardLineStyle: "dashed",
      cardShadowEnabled: false,
      cardRoundedEnabled: true,
      cardRadiusMm: 4,
      imageRoundedEnabled: true,
      imageRadiusMm: 3,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    settings: {
      textColorHex: "#0f172a",
      textShadowEnabled: true,
      fontName: "Verdana",
      fontGoogleName: "Montserrat",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "radial",
      cardBackgroundGradientDirection: "diagonal",
      cardBackgroundGradColor1Hex: "#bff7ff",
      cardBackgroundGradColor2Hex: "#ffe3b3",
      cardBorderEnabled: true,
      cardBorderColorHex: "#0ea5e9",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#0ea5e9",
      cardLineWidthMm: 0.6,
      cardLineStyle: "dashed",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 6,
      imageRoundedEnabled: true,
      imageRadiusMm: 4,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "forest",
    name: "Leśna mgła",
    settings: {
      textColorHex: "#1f2a1f",
      textShadowEnabled: false,
      fontName: "Georgia",
      fontGoogleName: "Merriweather",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#f0fff4",
      cardBackgroundGradColor2Hex: "#b7e4c7",
      cardBorderEnabled: true,
      cardBorderColorHex: "#2f855a",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#2f855a",
      cardLineWidthMm: 0.6,
      cardLineStyle: "solid",
      cardShadowEnabled: false,
      cardRoundedEnabled: true,
      cardRadiusMm: 5,
      imageRoundedEnabled: true,
      imageRadiusMm: 3.5,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "sunset",
    name: "Zachód słońca",
    settings: {
      textColorHex: "#1f2937",
      textShadowEnabled: true,
      fontName: "Arial",
      fontGoogleName: "Raleway",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "horizontal",
      cardBackgroundGradColor1Hex: "#fde68a",
      cardBackgroundGradColor2Hex: "#fca5a5",
      cardBorderEnabled: true,
      cardBorderColorHex: "#f97316",
      cardBorderWidthMm: 0.8,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#f97316",
      cardLineWidthMm: 0.8,
      cardLineStyle: "dashed",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 7,
      imageRoundedEnabled: true,
      imageRadiusMm: 4.5,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "candy",
    name: "Candy Pop",
    settings: {
      textColorHex: "#3b0764",
      textShadowEnabled: true,
      fontName: "Verdana",
      fontGoogleName: "Baloo 2",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "diagonal",
      cardBackgroundGradColor1Hex: "#fbcfe8",
      cardBackgroundGradColor2Hex: "#bae6fd",
      cardBorderEnabled: true,
      cardBorderColorHex: "#f472b6",
      cardBorderWidthMm: 0.8,
      cardBorderStyle: "dashed",
      cardLineEnabled: true,
      cardLineColorHex: "#f472b6",
      cardLineWidthMm: 0.6,
      cardLineStyle: "dotted",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 8,
      imageRoundedEnabled: true,
      imageRadiusMm: 5,
      imageShadowEnabled: true,
      showCutLines: false,
    },
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    settings: {
      textColorHex: "#0f172a",
      textShadowEnabled: false,
      fontName: "Arial",
      fontGoogleName: "Nunito",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "radial",
      cardBackgroundGradientDirection: "diagonal",
      cardBackgroundGradColor1Hex: "#cffafe",
      cardBackgroundGradColor2Hex: "#bae6fd",
      cardBorderEnabled: true,
      cardBorderColorHex: "#0284c7",
      cardBorderWidthMm: 0.6,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#0284c7",
      cardLineWidthMm: 0.6,
      cardLineStyle: "solid",
      cardShadowEnabled: false,
      cardRoundedEnabled: true,
      cardRadiusMm: 6,
      imageRoundedEnabled: true,
      imageRadiusMm: 4,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "minimal",
    name: "Minimal Bold",
    settings: {
      textColorHex: "#111827",
      textShadowEnabled: false,
      fontName: "Arial",
      fontGoogleName: "",
      fontGoogleEnabled: false,
      cardBackgroundMode: "white",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#ffffff",
      cardBackgroundGradColor2Hex: "#ffffff",
      cardBorderEnabled: true,
      cardBorderColorHex: "#111827",
      cardBorderWidthMm: 0.4,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#111827",
      cardLineWidthMm: 0.4,
      cardLineStyle: "solid",
      cardShadowEnabled: false,
      cardRoundedEnabled: false,
      cardRadiusMm: 0,
      imageRoundedEnabled: false,
      imageRadiusMm: 0,
      imageShadowEnabled: false,
      showCutLines: false,
    },
  },
  {
    id: "deco",
    name: "Art Deco",
    settings: {
      textColorHex: "#1c1917",
      textShadowEnabled: true,
      fontName: "Times New Roman",
      fontGoogleName: "Playfair Display",
      fontGoogleEnabled: true,
      cardBackgroundMode: "gradient",
      cardBackgroundColorHex: "#ffffff",
      cardBackgroundGradientType: "linear",
      cardBackgroundGradientDirection: "vertical",
      cardBackgroundGradColor1Hex: "#fef9c3",
      cardBackgroundGradColor2Hex: "#fde68a",
      cardBorderEnabled: true,
      cardBorderColorHex: "#a16207",
      cardBorderWidthMm: 0.9,
      cardBorderStyle: "solid",
      cardLineEnabled: true,
      cardLineColorHex: "#a16207",
      cardLineWidthMm: 0.6,
      cardLineStyle: "solid",
      cardShadowEnabled: true,
      cardRoundedEnabled: true,
      cardRadiusMm: 5,
      imageRoundedEnabled: true,
      imageRadiusMm: 3.5,
      imageShadowEnabled: true,
      showCutLines: false,
    },
  },
];

function createDefaultProject() {
  return {
    version: 2,
    mode: "text",
    textHtml: "",
    images: [],
    settingsByMode: {
      text: createDefaultSettings(),
      image: createDefaultSettings(),
    },
    stylePresetByMode: {
      text: "custom",
      image: "custom",
    },
  };
}

function setDirty(isDirty) {
  state.dirty = isDirty;
  elements.dirtyIndicator.textContent = isDirty ? "● Zmieniono" : "";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSettingsForMode(mode = state.project.mode) {
  return state.project.settingsByMode[mode];
}

function setSettingsForMode(mode, settings) {
  state.project.settingsByMode[mode] = settings;
}

function getStylePresetForMode(mode = state.project.mode) {
  return state.project.stylePresetByMode[mode] || "custom";
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
  elements.stylePreset.value = getStylePresetForMode(tab);
  applySettingsToInputs(getSettingsForMode(tab));
  setDirty(true);
  schedulePreview();
}

function updateSettingsFromInputs() {
  const settings = getSettingsForMode();
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
  settings.cardBackgroundMode = elements.cardBgMode.value;
  settings.cardBackgroundColorHex = elements.cardBgColor.value;
  settings.cardBackgroundGradientType = elements.cardBgGradientType.value;
  settings.cardBackgroundGradientDirection = elements.cardBgGradientDirection.value;
  settings.cardBackgroundGradColor1Hex = elements.cardBgGrad1.value;
  settings.cardBackgroundGradColor2Hex = elements.cardBgGrad2.value;
  settings.cardBorderEnabled = elements.cardBorderEnabled.checked;
  settings.cardBorderColorHex = elements.cardBorderColor.value;
  settings.cardBorderWidthMm = clamp(Number(elements.cardBorderWidth.value) || 0, 0, 5);
  settings.cardBorderStyle = elements.cardBorderStyle.value;
  settings.cardLineEnabled = elements.cardLineEnabled.checked;
  settings.cardLineColorHex = elements.cardLineColor.value;
  settings.cardLineWidthMm = clamp(Number(elements.cardLineWidth.value) || 0, 0, 5);
  settings.cardLineStyle = elements.cardLineStyle.value;
  settings.cardShadowEnabled = elements.cardShadowEnabled.checked;
  settings.cardRoundedEnabled = elements.cardRoundedEnabled.checked;
  settings.cardRadiusMm = clamp(Number(elements.cardRadius.value) || 0, 0, 10);
  settings.imageRoundedEnabled = elements.imageRoundedEnabled.checked;
  settings.imageRadiusMm = clamp(Number(elements.imageRadius.value) || 0, 0, 10);
  settings.imageShadowEnabled = elements.imageShadowEnabled.checked;
  settings.showCutLines = elements.showCutLines.checked;
}

function applySettingsToInputs(settings = getSettingsForMode()) {
  elements.textColor.value = settings.textColorHex;
  elements.textShadow.checked = settings.textShadowEnabled;
  elements.fontName.value = settings.fontName;
  elements.fontGoogle.value = settings.fontGoogleName || "";
  elements.fontGoogleEnabled.checked = settings.fontGoogleEnabled;
  elements.fontSizeMode.value = settings.fontSizePtMode;
  elements.fontSizeFixed.value = settings.fontSizePtFixed;
  elements.cardBgMode.value = settings.cardBackgroundMode;
  elements.cardBgColor.value = settings.cardBackgroundColorHex;
  elements.cardBgGradientType.value = settings.cardBackgroundGradientType;
  elements.cardBgGradientDirection.value = settings.cardBackgroundGradientDirection;
  elements.cardBgGrad1.value = settings.cardBackgroundGradColor1Hex;
  elements.cardBgGrad2.value = settings.cardBackgroundGradColor2Hex;
  elements.cardBorderEnabled.checked = settings.cardBorderEnabled;
  elements.cardBorderColor.value = settings.cardBorderColorHex;
  elements.cardBorderWidth.value = settings.cardBorderWidthMm;
  elements.cardBorderStyle.value = settings.cardBorderStyle;
  elements.cardLineEnabled.checked = settings.cardLineEnabled;
  elements.cardLineColor.value = settings.cardLineColorHex;
  elements.cardLineWidth.value = settings.cardLineWidthMm;
  elements.cardLineStyle.value = settings.cardLineStyle;
  elements.cardShadowEnabled.checked = settings.cardShadowEnabled;
  elements.cardRoundedEnabled.checked = settings.cardRoundedEnabled;
  elements.cardRadius.value = settings.cardRadiusMm;
  elements.imageRoundedEnabled.checked = settings.imageRoundedEnabled;
  elements.imageRadius.value = settings.imageRadiusMm;
  elements.imageShadowEnabled.checked = settings.imageShadowEnabled;
  elements.showCutLines.checked = settings.showCutLines;
  updateFontSizeModeUI();
  refreshFontStatus();
  updateTextFitWarning("");
  syncConditionalFields();
  if (state.project.mode === "text") {
    updateEditorFont();
  }
}

function bindSettingsEvents() {
  const inputs = document.querySelectorAll(
    "#text-color, #text-shadow, #font-name, #font-google, #font-size-mode, #font-size-fixed, #card-bg-mode, #card-bg-color, #card-bg-gradient-type, #card-bg-gradient-direction, #card-bg-grad-1, #card-bg-grad-2, #card-border-enabled, #card-border-color, #card-border-width, #card-border-style, #card-line-enabled, #card-line-color, #card-line-width, #card-line-style, #card-shadow-enabled, #card-rounded-enabled, #card-radius, #image-rounded-enabled, #image-radius, #image-shadow-enabled, #show-cutlines"
  );

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateSettingsFromInputs();
      syncConditionalFields();
      if (state.project.mode === "text") {
        updateEditorFont();
      }
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

function refreshFontStatus() {
  const settings = getSettingsForMode();
  if (!settings.fontGoogleEnabled) {
    updateFontStatus("Używana czcionka systemowa.");
    return;
  }
  if (!settings.fontGoogleName) {
    updateFontStatus("Wprowadź nazwę Google Font.");
    return;
  }
  if (state.loadedGoogleFonts.has(settings.fontGoogleName)) {
    updateFontStatus(`Wczytano Google Font: ${settings.fontGoogleName}`);
    return;
  }
  updateFontStatus("Sprawdzam Google Fonts...");
  loadGoogleFont(settings.fontGoogleName).then((loaded) => {
    updateFontStatus(
      loaded
        ? `Wczytano Google Font: ${settings.fontGoogleName}`
        : `Nie znaleziono Google Font: ${settings.fontGoogleName}`
    );
    updateEditorFont();
    schedulePreview();
  });
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
  const settings = getSettingsForMode();
  const bgMode = settings.cardBackgroundMode;
  toggleFields(elements.bgColorFields, bgMode === "color");
  toggleFields(elements.bgGradientFields, bgMode === "gradient");

  toggleDisabled(elements.borderFields, !settings.cardBorderEnabled);
  toggleDisabled(elements.lineFields, !settings.cardLineEnabled);
  toggleDisabled(elements.cardRadiusFields, !settings.cardRoundedEnabled);
  toggleDisabled(elements.imageRadiusFields, !settings.imageRoundedEnabled);

  const googleEnabled = settings.fontGoogleEnabled;
  toggleFields(elements.fontGoogleFields, googleEnabled);
  toggleFields(elements.fontSystemFields, !googleEnabled);

  const isImageMode = state.project.mode === "image";
  toggleFields(elements.imageOnlyFields, isImageMode);
}

async function loadGoogleFont(name) {
  if (!name) {
    return false;
  }
  if (state.loadedGoogleFonts.has(name)) {
    return true;
  }
  const href = getGoogleFontHref(name);
  try {
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
  } catch (error) {
    return false;
  }
}

function getGoogleFontHref(name) {
  const urlName = name.trim().replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${urlName}:wght@400;700&display=swap`;
}

function updateEditorFont() {
  if (!state.editorReady) {
    return;
  }
  const editor = tinymce.get("text-editor");
  if (!editor) {
    return;
  }
  const settings = getSettingsForMode("text");
  const fontFamily = getFontFamily(settings);
  editor.getBody().style.fontFamily = fontFamily;
  const editorColor = getCurrentTheme() === "dark" ? "#ffffff" : "#000000";
  editor.getBody().style.color = editorColor;
}

function setupTabs() {
  elements.tabs.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });
}

function setupSettingsTabs() {
  const setActiveTab = (tabId) => {
    elements.settingsTabs.forEach((tab) =>
      tab.classList.toggle("active", tab.dataset.settingsTab === tabId)
    );
    elements.settingsPanels.forEach((panel) =>
      panel.classList.toggle("hidden", panel.dataset.settingsPanel !== tabId)
    );
  };

  elements.settingsTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(button.dataset.settingsTab);
    });
  });

  setActiveTab("text");
}

function getCurrentTheme() {
  return document.body.classList.contains("theme-dark") ? "dark" : "light";
}

function getEditorThemeConfig(theme) {
  return theme === "dark"
    ? { skin: "oxide-dark", content_css: "dark" }
    : { skin: "oxide", content_css: "default" };
}

function buildEditorConfig(initialContent, theme) {
  const themeConfig = getEditorThemeConfig(theme);
  return {
    selector: "#text-editor",
    menubar: false,
    statusbar: false,
    branding: false,
    height: 260,
    plugins: "autolink",
    toolbar: "bold italic underline | removeformat",
    newline_behavior: "linebreak",
    forced_root_block: "div",
    forced_root_block_attrs: {},
    paste_as_text: true,
    skin: themeConfig.skin,
    content_css: themeConfig.content_css,
    setup: (editor) => {
      editor.on("init", () => {
        editor.setContent(initialContent || "");
        state.editorReady = true;
        updateEditorFont();
        schedulePreview();
      });
      editor.on("input change keyup", () => {
        state.project.textHtml = editor.getContent({ format: "html" });
        setDirty(true);
        schedulePreview();
      });
    },
  };
}

function setupEditor(initialContent = state.project.textHtml || "") {
  tinymce.init(buildEditorConfig(initialContent, getCurrentTheme()));
}

function refreshEditorTheme(theme) {
  const editor = tinymce.get("text-editor");
  if (!editor) {
    return;
  }
  const themeConfig = getEditorThemeConfig(theme);
  const currentSkin = editor.settings?.skin;
  const currentContentCss = editor.settings?.content_css;
  if (currentSkin === themeConfig.skin && currentContentCss === themeConfig.content_css) {
    return;
  }
  const content = editor.initialized
    ? editor.getContent({ format: "html" })
    : state.project.textHtml || "";
  editor.remove();
  state.editorReady = false;
  tinymce.init(buildEditorConfig(content, theme));
}

function normalizeHtmlToItems(html) {
  if (!html) {
    return [];
  }
  let normalized = html
    .replace(/\n/g, "")
    .replace(/<p([^>]*)>/gi, '<span data-block="1"$1>')
    .replace(/<\/p>/gi, "</span><br>")
    .replace(/<div([^>]*)>/gi, '<span data-block="1"$1>')
    .replace(/<\/div>/gi, "</span><br>");

  const parts = normalized.split(/<br\s*\/?\s*>/i);
  return parts
    .map((part) => part.trim())
    .filter((part) => stripHtml(part).replace(/&nbsp;/g, " ").trim().length > 0);
}

function appendQuestionToItem(html) {
  if (!html) {
    return html;
  }
  if (html.includes("</span>")) {
    return html.replace(
      /<\/span>(?!.*<\/span>)/,
      '&nbsp;<span class="question">?</span></span>'
    );
  }
  return `${html}&nbsp;<span class="question">?</span>`;
}

function prepareItemsForFit(itemsHtml) {
  return itemsHtml.map((item) => appendQuestionToItem(item));
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

function pxToMm(valuePx) {
  if (!state.mmToPx) {
    state.mmToPx = computeMmToPx();
  }
  return Math.round((Number(valuePx) / state.mmToPx) * 100) / 100;
}

function normalizeSettings(settings = {}) {
  const normalized = { ...createDefaultSettings(), ...settings };
  if (settings.cardBorderWidthMm == null && settings.cardBorderWidthPx != null) {
    normalized.cardBorderWidthMm = pxToMm(settings.cardBorderWidthPx);
  }
  if (settings.cardLineWidthMm == null && settings.cardLineWidthPx != null) {
    normalized.cardLineWidthMm = pxToMm(settings.cardLineWidthPx);
  }
  if (settings.imageRadiusMm == null && settings.imageRadiusPx != null) {
    normalized.imageRadiusMm = pxToMm(settings.imageRadiusPx);
  }
  return normalized;
}

function getFontFamily(settings) {
  const hasGoogleFont = settings.fontGoogleEnabled && settings.fontGoogleName;
  return hasGoogleFont
    ? `"${settings.fontGoogleName}", "${settings.fontName}", serif`
    : `"${settings.fontName}", serif`;
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
  measure.style.fontFamily = getFontFamily(settings);
  measure.style.fontSize = "28pt";
  measure.style.lineHeight = "1.1";
  measure.style.wordBreak = "normal";
  measure.style.overflowWrap = "normal";
  measure.style.wordWrap = "normal";
  measure.style.overflow = "hidden";
  measure.style.display = "block";
  measure.style.textAlign = "center";

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
  measure.style.fontFamily = getFontFamily(settings);
  measure.style.fontSize = `${fontPt}pt`;
  measure.style.lineHeight = "1.1";
  measure.style.wordBreak = "normal";
  measure.style.overflowWrap = "normal";
  measure.style.wordWrap = "normal";
  measure.style.overflow = "hidden";
  measure.style.display = "block";
  measure.style.textAlign = "center";

  for (const item of fitItems) {
    measure.innerHTML = `<div class="measure-header" style="margin-bottom:2mm;">Ja mam</div><div class="measure-word">${item}</div>`;
    if (measure.scrollWidth > measure.clientWidth || measure.scrollHeight > measure.clientHeight) {
      return false;
    }
  }
  return true;
}

function buildCss(settings, fontPt) {
  const fontFamily = getFontFamily(settings);
  const textShadowCss = settings.textShadowEnabled
    ? "text-shadow: 0 0.4mm 0.8mm rgba(0,0,0,0.35);"
    : "text-shadow: none;";

  let borderCss = "border: none;";
  if (settings.cardBorderEnabled && settings.cardBorderWidthMm > 0) {
    borderCss = `border: ${settings.cardBorderWidthMm}mm ${settings.cardBorderStyle} ${settings.cardBorderColorHex};`;
  }

  let lineCss = "border-top: none;";
  let lineDisplay = "display: none;";
  if (settings.cardLineEnabled && settings.cardLineWidthMm > 0) {
    lineCss = `border-top: ${settings.cardLineWidthMm}mm ${settings.cardLineStyle} ${settings.cardLineColorHex};`;
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

  const imageRadiusValue = settings.imageRoundedEnabled ? settings.imageRadiusMm : 0;
  const imageShadowCss = settings.imageShadowEnabled
    ? "box-shadow: 0 1.2mm 2.4mm rgba(0,0,0,0.25);"
    : "box-shadow: none;";

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
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
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
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

@media screen {
  body {
    background: transparent;
    user-select: none;
    -webkit-user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6mm;
    padding: 6mm 0;
  }

  .page {
    margin: 0;
    background: transparent;
    box-shadow: none;
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
  margin: 0;
  position: relative;
  width: 100%;
  height: 100%;
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
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
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
  line-height: 1.1;
  word-break: normal;
  overflow-wrap: normal;
  hyphens: manual;
  color: ${settings.textColorHex};
  text-align: center;
  ${textShadowCss}
}

.text-card .header {
  margin-bottom: 2mm;
  text-align: center;
}

.text-card span[data-block="1"] {
  display: block;
}

.text-card .word {
  max-height: 100%;
  overflow: hidden;
  word-break: normal;
  overflow-wrap: anywhere;
  padding: 0 1.2mm;
  max-width: 100%;
}

.text-card .question {
  display: inline;
  margin-left: 0.4mm;
}

.image-card .header {
  font-size: ${fontPt}pt;
  line-height: 1.1;
  margin-bottom: 2mm;
  color: ${settings.textColorHex};
  text-align: center;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.image-card .img-box {
  flex: 1 1 auto;
  display: flex;
  margin: 0 auto;
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
  padding: 1mm;
  overflow: visible;
  align-items: center;
  justify-content: center;
}

.image-card img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  border-radius: ${imageRadiusValue}mm;
  ${imageShadowCss}
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

function buildFullHtml(css, body, settings) {
  const fontLink =
    settings.fontGoogleEnabled && settings.fontGoogleName
      ? `<link rel="stylesheet" href="${getGoogleFontHref(settings.fontGoogleName)}" />`
      : "";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Karty</title>
  ${fontLink}
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
        const bottom = appendQuestionToItem(itemsHtml[bottomIndex]);
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
  const settings = getSettingsForMode();
  let body = "";
  let fontPt = settings.fontSizePtFixed;

  if (state.project.mode === "text") {
    if (state.editorReady) {
      const editor = tinymce.get("text-editor");
      if (editor) {
        state.project.textHtml = editor.getContent({ format: "html" });
      }
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
  const html = buildFullHtml(css, body, settings);
  elements.previewFrame.srcdoc = html;
  elements.previewFrame.onload = () => {
    updatePreviewFrameSize();
    applyPreviewScale(elements.previewScale.value);
  };
}

function applyPreviewScale(scaleValue) {
  const scale =
    clamp(Number(scaleValue) || 100, PREVIEW_SCALE_MIN, PREVIEW_SCALE_MAX) / 100;
  elements.previewScaleValue.textContent = `${Math.round(scale * 100)}%`;
  elements.previewFrame.style.transform = `scale(${scale})`;
}

function fitPreviewToWidth() {
  if (!state.mmToPx) {
    state.mmToPx = computeMmToPx();
  }
  const pageWidthPx = state.previewBaseWidth || 297 * state.mmToPx;
  const viewportWidth = elements.previewViewport.clientWidth;
  const scale = clamp(
    (viewportWidth / pageWidthPx) * 100,
    PREVIEW_SCALE_MIN,
    PREVIEW_SCALE_MAX
  );
  elements.previewScale.value = Math.round(scale);
  applyPreviewScale(scale);
}

function updatePreviewFrameSize() {
  const previewDocument = elements.previewFrame.contentDocument;
  if (!previewDocument) {
    return;
  }
  const { body, documentElement } = previewDocument;
  const width = Math.max(body.scrollWidth, documentElement.scrollWidth);
  const height = Math.max(body.scrollHeight, documentElement.scrollHeight);
  if (!width || !height) {
    return;
  }
  state.previewBaseWidth = width;
  state.previewBaseHeight = height;
  elements.previewFrame.style.width = `${width}px`;
  elements.previewFrame.style.height = `${height}px`;
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
  elements.stylePreset.value = getStylePresetForMode();
  applySettingsToInputs(getSettingsForMode());
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
  state.project.version = 2;
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
      if (!data || (data.version !== 1 && data.version !== 2)) {
        throw new Error("Nieobsługiwany format projektu.");
      }
      const legacySettings = data.settings ? normalizeSettings(data.settings) : null;
      const settingsByMode = data.settingsByMode || {};
      const normalizedTextSettings = normalizeSettings(
        settingsByMode.text || legacySettings || createDefaultSettings()
      );
      const normalizedImageSettings = normalizeSettings(
        settingsByMode.image || legacySettings || createDefaultSettings()
      );
      state.project = {
        version: 2,
        mode: data.mode === "image" ? "image" : "text",
        textHtml: data.textHtml || "",
        images: Array.isArray(data.images) ? data.images : [],
        settingsByMode: {
          text: normalizedTextSettings,
          image: normalizedImageSettings,
        },
        stylePresetByMode: {
          text: data.stylePresetByMode?.text || "custom",
          image: data.stylePresetByMode?.image || "custom",
        },
      };
      elements.stylePreset.value = getStylePresetForMode(state.project.mode);
      applySettingsToInputs(getSettingsForMode());
      renderImageList();
      if (state.editorReady) {
        const editor = tinymce.get("text-editor");
        if (editor) {
          editor.setContent(state.project.textHtml || "");
        }
      }
      switchTab(state.project.mode);
      setDirty(false);
      refreshFontStatus();
      schedulePreview();
    } catch (error) {
      window.alert(`Nie udało się wczytać projektu: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function handlePrint() {
  renderPreview();
  const settings = getSettingsForMode();
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
  const html = buildFullHtml(css, body, settings);
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
    refreshFontStatus();
    updateEditorFont();
    schedulePreview();
  });

  elements.fontGoogleEnabled.addEventListener("change", () => {
    updateSettingsFromInputs();
    syncConditionalFields();
    refreshFontStatus();
    updateEditorFont();
    schedulePreview();
  });

  elements.fontGoogle.addEventListener("change", async () => {
    updateSettingsFromInputs();
    refreshFontStatus();
    updateEditorFont();
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
    if (elements.stylePreset.value === "custom") {
      state.project.stylePresetByMode[state.project.mode] = "custom";
      setDirty(true);
      return;
    }
    const preset = STYLE_PRESETS.find((item) => item.id === elements.stylePreset.value);
    if (!preset) {
      return;
    }
    const currentSettings = getSettingsForMode();
    setSettingsForMode(state.project.mode, {
      ...currentSettings,
      ...preset.settings,
    });
    state.project.stylePresetByMode[state.project.mode] = elements.stylePreset.value;
    applySettingsToInputs(getSettingsForMode());
    syncConditionalFields();
    updateEditorFont();
    setDirty(true);
    schedulePreview();
  });
  elements.stylePreset.value = getStylePresetForMode();
}

function setupPreviewControls() {
  applyPreviewScale(elements.previewScale.value);
  elements.previewScale.addEventListener("input", (event) => {
    applyPreviewScale(event.target.value);
  });
  elements.previewFit.addEventListener("click", () => {
    fitPreviewToWidth();
  });
  if (elements.previewViewport) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;

    const stopDragging = (event) => {
      if (!isDragging) {
        return;
      }
      isDragging = false;
      elements.previewViewport.classList.remove("is-dragging");
      if (event && elements.previewViewport.hasPointerCapture(event.pointerId)) {
        elements.previewViewport.releasePointerCapture(event.pointerId);
      }
    };

    elements.previewViewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startScrollLeft = elements.previewViewport.scrollLeft;
      startScrollTop = elements.previewViewport.scrollTop;
      elements.previewViewport.classList.add("is-dragging");
      elements.previewViewport.setPointerCapture(event.pointerId);
    });

    elements.previewViewport.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      elements.previewViewport.scrollLeft = startScrollLeft - deltaX;
      elements.previewViewport.scrollTop = startScrollTop - deltaY;
    });

    elements.previewViewport.addEventListener("pointerup", stopDragging);
    elements.previewViewport.addEventListener("pointerleave", stopDragging);
    elements.previewViewport.addEventListener("pointercancel", stopDragging);
  }
  if (elements.mobilePreviewToggle && elements.previewPanel) {
    elements.mobilePreviewToggle.addEventListener("click", () => {
      elements.previewPanel.classList.toggle("is-open");
    });
  }
  window.addEventListener("resize", () => {
    fitPreviewToWidth();
  });
}

function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  if (elements.themeToggle) {
    elements.themeToggle.checked = theme === "dark";
  }
  refreshEditorTheme(theme);
}

function setupThemeToggle() {
  if (!elements.themeToggle) {
    return;
  }
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = storedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);
  elements.themeToggle.addEventListener("change", (event) => {
    const theme = event.target.checked ? "dark" : "light";
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  });
}

function init() {
  setupThemeToggle();
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
  refreshFontStatus();
  schedulePreview();
}

init();
