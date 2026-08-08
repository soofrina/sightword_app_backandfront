import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { HexColorPicker } from "react-colorful";

const ColorCircle = ({ color, onClick }: { color: string, onClick: () => void }) => {
  return (
    <button
      style={{ backgroundColor: color }}
      className="rounded-full h-5 w-5 border-2"
      onClick={onClick}
    />
  );
};

interface FabricColorControlButtonProps {
  setBrushColor: (color: string) => void;
  fabricRef: React.RefObject<unknown>;
  initColor: string;
  currentBrushColor: string;
}

const FabricColorControlButton: React.FC<FabricColorControlButtonProps> = ({ 
  setBrushColor, 
  fabricRef, 
  currentBrushColor, 
  initColor 
}: FabricColorControlButtonProps) => {
  const [color, setColor] = useState<string>(initColor);
  const [selectionState, setSelectionState] = useState<number>(0); // 0 -> nothing, 1 -> selected color for brush, 2 -> show popup
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [colorPickerColor, setColorPickerColor] = useState<string | undefined>();

  useEffect(() => {
    if (selectionState === 1) {
      if (fabricRef?.current == null) {
        return;
      }
      const fabric = fabricRef.current as fabric.Canvas;

      setBrushColor(color);
      fabric.freeDrawingBrush.color = color;
    }
  }, [selectionState]);

  useEffect(() => {
    if (currentBrushColor !== color) {
      setSelectionState(0);
    }
  }, [currentBrushColor]);

  const colorCircleOnClick = (color: string) => () => {
    setColor(color);
    setSelectionState(1);
  };

  const colorPickerButtonOnClick = () => {
    if (!colorPickerColor) return;

    setColor(colorPickerColor);
    setSelectionState(1);
    setShowColorPicker(false);
  };

  return <div className="relative">
    <button
      style={{ backgroundColor: color, borderColor: currentBrushColor === color ? "#ABABAB" : "#817F83" }}
      className="rounded-full h-5 w-5 border-2"
      onClick={() => {
        if (selectionState === 2) {
          setSelectionState(selectionState - 1);
        } else {
          setSelectionState(selectionState + 1);
        }
      }}
    />
    {selectionState === 2 && ReactDOM.createPortal(
      <div 
        className="absolute top-0 bottom-0 left-0 right-0 bg-transparent z-1" 
        onClick={() => setSelectionState(1)}
      />,
      document.body
    )}
    {selectionState === 2 && 
      <div className="absolute right-0 top-100 bg-white text-black z-10 grid grid-cols-1 auto-rows-min w-[150px] rounded-lg drop-shadow">
        <div className="bg-[#817f83] text-center text-white h-fit py-1 rounded-t-lg">
          <p>Pen Color</p>
        </div>
        {!showColorPicker && <div className="flex flex-row flex-wrap b-[#ABABAB] gap-2 p-2 rounded-b-lg">
          <ColorCircle color="#01BF5B" onClick={colorCircleOnClick("#01BF5B")} />
          <ColorCircle color="#DE1212" onClick={colorCircleOnClick("#DE1212")} />
          <ColorCircle color="#F4C82A" onClick={colorCircleOnClick("#F4C82A")} />
          <ColorCircle color="#414042" onClick={colorCircleOnClick("#414042")} />
          <ColorCircle color="#9747FF" onClick={colorCircleOnClick("#9747FF")} />
          <ColorCircle color="#F0ACA1" onClick={colorCircleOnClick("#F0ACA1")} />
          <button
            className="rounded-full h-5 w-5 border-2 border-dashed border-[#817F83]"
            onClick={() => setShowColorPicker(true)}
          />
        </div>}
        {showColorPicker && <div className="flex flex-col items-center justify-center bg-[#ABABAB] h-fit p-1 gap-2 rounded-b-lg">
          <HexColorPicker color={colorPickerColor} onChange={setColorPickerColor} />
          {colorPickerColor && <div className="flex justify-center items-center gap-2">
            <div style={{ backgroundColor: colorPickerColor }} className="w-5 h-5 rounded-full" />
            <button className="text-white" onClick={colorPickerButtonOnClick}>Add color</button>
          </div>}
        </div>}
      </div>
    }
  </div>;
};

export default FabricColorControlButton;