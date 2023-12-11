// useItemDetails.js
import { useEffect } from "react";

export function useItemDetails(data, setModalData, setOpenModal) {
  useEffect(() => {
    const itemId = new URLSearchParams(window.location.search).get("id");

    if (itemId) {
      // Ensure that data.categories is an array before using it
      if (Array.isArray(data.categories)) {
        const selectedItemArray = data.categories.find((item) => item.id === itemId);

        if (selectedItemArray) {
          setModalData(selectedItemArray);

          const itemElement = document.getElementById(`item-${selectedItemArray.id}`);
          if (itemElement) {
            itemElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }

          setOpenModal(true);
        }
      }
    }
  }, [data, setModalData, setOpenModal]);
}
