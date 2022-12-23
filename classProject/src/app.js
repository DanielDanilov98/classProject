import { ABOUT_PAGE_LINK, LINK_HOME_PAGE, HOME_PAGE_LINK, CREATE_PIC_PAGE_LINK, LOGIN_PAGE_LINK, SLIDER_PREV_BTN, SLIDER_NEXT_BTN } from "./services/domService.js";
import PAGES from "./models/pageModel.js";
import { onChangePage } from "./routes/router.js";
import { renderSlider } from "./services/renderSlider.js";
import { setCounter } from "./services/picService.js";
import INITIAL_DATA from "./initialData/initialData.js";

//#region let
let pictures = INITIAL_DATA.pictures;
let counter = 0;
//#endregion

renderSlider(pictures);

//slider logic
const onChangeSliderPic = (controller) => {
  counter = setCounter(pictures, counter, controller);
  renderSlider(pictures, counter);
};

//#region האזנה לאירועים
// page
HOME_PAGE_LINK.addEventListener("click", () => onChangePage(PAGES.HOME));
ABOUT_PAGE_LINK.addEventListener("click", () => onChangePage(PAGES.ABOUT));
CREATE_PIC_PAGE_LINK.addEventListener("click", () => onChangePage(PAGES.CREATE_PIC));
LOGIN_PAGE_LINK.addEventListener("click", () => onChangePage(PAGES.LOGIN));
LINK_HOME_PAGE.addEventListener("click", () => onChangePage(PAGES.HOME));

// slider
SLIDER_PREV_BTN.addEventListener("click", () => onChangeSliderPic("prev"));
SLIDER_NEXT_BTN.addEventListener("click", () => onChangeSliderPic("next"));
//#endregion
