import { handleSubmitNewPic, onSubmitEditPic } from "../app.js";
import DISPLAY from "../models/displayModel.js";
import PAGES from "../models/pageModel.js";
import Picture from "../models/PictureModel.js";
import { onChangeDisplayMode, onChangePage } from "../routes/router.js";
import {
  ALT_CREATE_PIC_ERROR,
  ALT_CREATE_PIC_FIELD,
  ALT_EDIT_PIC_ERROR,
  ALT_EDIT_PIC_FIELD,
  CANCEL_BTN,
  CANCELֹ_EDIT_BTN,
  CREDIT_CREATE_PIC_ERROR,
  CREDIT_CREATE_PIC_FIELD,
  CREDIT_EDIT_PIC_ERROR,
  CREDIT_EDIT_PIC_FIELD,
  EDIT_IMAGE_DISPLAY,
  PRICE_CREATE_PIC_ERROR,
  PRICE_CREATE_PIC_FIELD,
  PRICE_EDIT_PIC_ERROR,
  PRICE_EDIT_PIC_FIELD,
  SUBMIT_CREATE_PIC_BTN,
  SUBMIT_EDIT_PIC_BTN,
  URL_CREATE_PIC_ERROR,
  URL_CREATE_PIC_FIELD,
  URL_EDIT_PIC_ERROR,
  URL_EDIT_PIC_FIELD,
} from "./domService.js";
import useForm from "./formService.js";

window.pic = {};
const { onChangeInputField } = useForm();

export const setCounter = (array, counter, controller = "") => {
  let newCounter;
  if (controller === "next") {
    newCounter = counter < array.length - 1 ? counter + 1 : 0;
    return newCounter;
  }

  if (controller === "prev") {
    newCounter = counter > 0 ? counter - 1 : array.length - 1;
    return newCounter;
  }

  return 0;
};

export const handleCreatePic = () => {
  // הגענו לדף
  onChangePage(PAGES.CREATE_PIC);

  // להרשם לאירועי הזנת המידע בשדות
  createPicFromFieldsListeners();

  const cancelEH = () => {
    const conf = confirm("Are you sure you want to cancel?");
    if (conf) handleCancelCreatePic();
  };

  CANCEL_BTN.removeEventListener("click", cancelEH);
  CANCEL_BTN.addEventListener("click", cancelEH);

  SUBMIT_CREATE_PIC_BTN.removeEventListener("click", handleSubmitNewPic);
  SUBMIT_CREATE_PIC_BTN.addEventListener("click", handleSubmitNewPic);
};

export const handleEditPic = (pictures, id) => {
  // הגענו לדף
  onChangePage(PAGES.EDIT_PIC);

  mapToModel(pictures, id); // שמים את המידע של התמונה שבחרנו לערוך בשדות בדף עריכה
  editPicListeners(); // מפעילים את כל החיישנים שקשורים לוולידציה

  // מתקניםפ באג מוזר שבו נרשמנו פעמיים לאותו האלמנט
  const anonymousFunc = () => onSubmitEditPic(id);
  SUBMIT_EDIT_PIC_BTN.removeEventListener("click", anonymousFunc);
  // rect on submit edit pic
  SUBMIT_EDIT_PIC_BTN.addEventListener("click", anonymousFunc);

  // rect on cancel edit pic
  const cancelEH = () => onCancelEditPic(pictures);
  CANCELֹ_EDIT_BTN.removeEventListener("click", cancelEH);
  CANCELֹ_EDIT_BTN.addEventListener("click", cancelEH);
};

export const mapToModel = (pictures, id) => {
  pic = pictures.find((x) => x._id === id);
  if (!pic) throw new Error(`No picture with id: ${id} was found`);
  const { url, price, alt, credit } = pic;
  URL_EDIT_PIC_FIELD.value = url;
  ALT_EDIT_PIC_FIELD.value = alt;
  CREDIT_EDIT_PIC_FIELD.value = credit;
  PRICE_EDIT_PIC_FIELD.value = price;
  EDIT_IMAGE_DISPLAY.src = url;
  EDIT_IMAGE_DISPLAY.alt = alt;
};

const editPicListeners = () => {
  const schema = ["url", "price", "alt", "credit"];

  // פונק' שרצה עם כל אינפוט ומקבלת את האירוע של ההכנסת המידע כארגומנט

  URL_EDIT_PIC_FIELD.addEventListener("input", (e) => {
    const validation = {
      regex: /^http[s]?\:\/\/.{1,}.(jpg|png|jpeg)$/g,
      min: 10,
      max: 256,
    };

    const element = {
      input: e.target,
      errorSpan: URL_EDIT_PIC_ERROR,
      validation,
    };

    onChangeInputField(schema, element, SUBMIT_EDIT_PIC_BTN);
    EDIT_IMAGE_DISPLAY.src = e.target.value;
  });

  ALT_EDIT_PIC_FIELD.addEventListener("input", (e) => {
    const element = {
      input: e.target,
      errorSpan: ALT_EDIT_PIC_ERROR,
      validation: { min: 2 },
    };

    onChangeInputField(schema, element, SUBMIT_EDIT_PIC_BTN);
    EDIT_IMAGE_DISPLAY.alt = e.target.value;
  });

  CREDIT_EDIT_PIC_FIELD.addEventListener("input", (e) =>
    onChangeInputField(
      schema,
      {
        input: e.target,
        errorSpan: CREDIT_EDIT_PIC_ERROR,
        validation: { min: 2 },
      },
      SUBMIT_EDIT_PIC_BTN
    )
  );

  PRICE_EDIT_PIC_FIELD.addEventListener("input", (e) =>
    onChangeInputField(
      schema,
      {
        input: e.target,
        errorSpan: PRICE_EDIT_PIC_ERROR,
        validation: { numMin: 1 },
      },
      SUBMIT_EDIT_PIC_BTN
    )
  );
};

export const onCancelEditPic = (pictures) => {
  const { onClearFormFields } = useForm();
  const errorsSpans = [ALT_EDIT_PIC_ERROR, CREDIT_EDIT_PIC_ERROR, PRICE_EDIT_PIC_ERROR, URL_EDIT_PIC_ERROR];
  const fields = [
    // בחירה שלכם אם תהעביר או לא, כי בכל מקרה הפונק' של ההעברה של המודל לשדות ידרוס הכל
    URL_EDIT_PIC_FIELD,
    ALT_EDIT_PIC_FIELD,
    CREDIT_EDIT_PIC_FIELD,
    PRICE_EDIT_PIC_FIELD,
  ];
  onClearFormFields(SUBMIT_EDIT_PIC_BTN, [], errorsSpans);
  onChangePage(PAGES.HOME);
  onChangeDisplayMode(pictures, DISPLAY.TABLE);
};

export const createPicFromFieldsListeners = () => {
  const schema = ["url", "price"];
  URL_CREATE_PIC_FIELD.addEventListener("input", (e) => {
    const validation = {
      regex: /^http[s]?\:\/\/.{1,}.(jpg|png|jpeg)$/g,
      min: 10,
      lowerCase: true,
    };

    const element = {
      input: e.target,
      errorSpan: URL_CREATE_PIC_ERROR,
      validation,
    };

    onChangeInputField(schema, element, SUBMIT_CREATE_PIC_BTN);
  });

  PRICE_CREATE_PIC_FIELD.addEventListener("input", (e) => {
    const validation = {
      regex: /^\d+$/,
      numMin: 100,
    };

    const element = {
      input: e.target,
      errorSpan: PRICE_CREATE_PIC_ERROR,
      validation,
    };

    onChangeInputField(schema, element, SUBMIT_CREATE_PIC_BTN);
  });
};

export const handleCancelCreatePic = () => {
  const { onClearFormFields } = useForm();
  const fields = [URL_CREATE_PIC_FIELD, ALT_CREATE_PIC_FIELD, CREDIT_CREATE_PIC_FIELD, PRICE_CREATE_PIC_FIELD];
  const errorSpans = [URL_CREATE_PIC_ERROR, ALT_CREATE_PIC_ERROR, CREDIT_CREATE_PIC_ERROR, PRICE_CREATE_PIC_ERROR];
  onClearFormFields(SUBMIT_CREATE_PIC_BTN, fields, errorSpans);
  onChangePage(PAGES.HOME);
};

export const onCreateNewPic = (pictures) => {
  try {
    let newArray = [...pictures];
    const pic = new Picture(
      {
        url: URL_CREATE_PIC_FIELD.value,
        alt: ALT_CREATE_PIC_FIELD.value,
        credit: CREDIT_CREATE_PIC_FIELD.value,
        price: PRICE_CREATE_PIC_FIELD.value,
      },
      newArray
    );
    newArray.push(pic);

    return newArray;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const onEditPic = (pictures, id) => {
  const pic = pictures.find((pic) => pic._id === id);
  if (!pic) throw new Error("No Picture Found");
  pic.url = URL_EDIT_PIC_FIELD.value;
  pic.alt = ALT_EDIT_PIC_FIELD.value;
  pic.credit = CREDIT_EDIT_PIC_FIELD.value;
  pic.price = PRICE_EDIT_PIC_FIELD.value;
  return pictures;
};
