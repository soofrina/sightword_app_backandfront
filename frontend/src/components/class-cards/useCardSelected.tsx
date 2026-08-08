import { useEffect, useRef } from "react";

/**
 * Custom hook to handle unselecting of a class card when a user clicks outside the card.
 * @param unselect Function to unselect a card
 * @returns A reference object. For this to work, the ref object must be passed to the outermost div as the ref prop.
 */
export default function useCardSelected(unselect: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  const handleUnselectCard = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      unselect();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleUnselectCard, true);
    return () => {
      document.removeEventListener("keydown", handleUnselectCard, true);
    };
  });

  return { ref };
}
