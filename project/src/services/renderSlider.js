import { SLIDER_IMAGE, SLIDER_CREDITS } from "./domService.js";
export const renderSlider = (pictures, num = 0) => {
  if (!pictures?.length) return null;
  const pic = pictures[num];
  const { url, alt, credit } = pic;
  SLIDER_IMAGE.src = url;
  SLIDER_IMAGE.alt = alt;
  SLIDER_CREDITS.textContent = credit;

  return;
};
