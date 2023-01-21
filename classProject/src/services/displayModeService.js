import { handleDeletePic } from "../app.js";
import renderCards from "../components/renderCard.js";
import renderTable from "../components/renderTable.js";
import DISPLAY from "../models/displayModel.js";
import { onChangeDisplayMode } from "../routes/router.js";
import { handleEditPic } from "./picService.js";

export const handleDisplayMode = (pictures, display) => {
  onChangeDisplayMode(pictures, display);
  if (display === DISPLAY.TABLE) {
    renderTable(pictures);
    pictures.forEach((pic) => {
      addEventOnDelete(pic._id);
      addOnEditPic(pictures, pic._id);
    });
    return display;
  }

  if (display === DISPLAY.CARDS) {
    renderCards(pictures);
    return display;
  }

  return display;
};

const addEventOnDelete = (id) => {
  const deleteButton = document.getElementById(`delete${id}`);
  deleteButton.addEventListener("click", () => handleDeletePic(id));
};

export const addOnEditPic = (pictures, id) => {
  document.getElementById(`edit${id}`).addEventListener("click", () => handleEditPic(pictures, id));
};
