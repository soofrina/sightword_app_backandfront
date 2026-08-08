import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import FabricColorControlButton from "./fabricColorControlButton";

import { ReactComponent as DrawingHintIcon } from "assets/DrawingHint.svg";
import { ReactComponent as UndoIcon } from "assets/Undo.svg";
import { ReactComponent as PencilIcon } from "assets/Pencil.svg";
import { ReactComponent as EraserIcon } from "assets/Eraser.svg";

interface DrawingFieldProps {
  fabricRef?: React.MutableRefObject<fabric.Canvas | null>;
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null>;
  className?: string;
  imageUrl?: string;
  word?: string;
}

// eslint-disable-next-line react/display-name
const DrawingField = forwardRef(
  (
    {
      className,
      imageUrl,
      fabricRef: exFabricRef,
      canvasRef: exCanvasRef,
      word,
    }: DrawingFieldProps,
    ref,
  ) => {
    const [isDrawing, setIsDrawing] = useState<boolean>(true);
    const [brushWidth, setBrushWidth] = useState<number>(1);
    const [brushColor, setBrushColor] = useState<string>("#000000");
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);
    const [shouldPing, setShouldPing] = useState<boolean>(false);

    const canvasContainer = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const [historyState] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      saveDrawing() {
        return toSvg();
      },
      resetCanvas() {
        reset();
      },
      toPng() {
        const canvasDataUrl = canvasRef.current?.toDataURL("image/png");
        return canvasDataUrl;
      },
    }));

    const toSvg = (): string | null => {
      if (!fabricRef.current) return null;

      return fabricRef.current.toSVG();
    };

    const reset = () => {
      const canvas = fabricRef.current;
      if (canvas == null) return;

      canvas.clear().renderAll();
    };

    const updateHistory = () => {
      const myjson = JSON.stringify(fabricRef.current);
      historyState.push(myjson);
    };

    const undo = () => {
      const canvas = fabricRef.current;
      if (canvas == null) return;

      canvas.clear().renderAll();
      if (historyState.length >= 1) {
        historyState.pop();
        canvas.loadFromJSON(historyState[historyState.length - 1], () => {
          null;
        });
      }
    };

    // switch to eraser mode
    const useEraser = () => {
      if (!fabricRef.current) {
        return;
      }
      const fabricCanvas = fabricRef.current;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      fabricCanvas.freeDrawingBrush = new fabric.EraserBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.width = brushWidth;

      setIsDrawing(false);
    };

    // switch to drawing mode
    const usePencil = () => {
      if (!fabricRef.current) {
        return;
      }
      const fabricCanvas = fabricRef.current;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.width = brushWidth;
      fabricRef.current.freeDrawingBrush.color = brushColor;

      setIsDrawing(true);
    };

    // Display ping every x intervals unless user has interacted before
    useEffect(() => {
      const timer = setInterval(() => {
        setShouldPing((shouldPing) => !shouldPing);
      }, 5000);

      return () => clearInterval(timer);
    }, []);

    // Initailises the canvas object
    useEffect(() => {
      if (!canvasContainer.current) return;
      if (!canvasRef.current) return;
      if (fabricRef.current) return;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line
      const canvas = new fabric.Canvas("canvas", {
        width: canvasContainer.current.clientWidth,
        height: canvasContainer.current.clientHeight,
        backgroundColor: "white",
        isDrawingMode: true,
      });

      canvas.on("path:created", () => {
        updateHistory();
      });

      fabricRef.current = canvas;
      if (exFabricRef) {
        exFabricRef.current = canvas;
      }
      if (exCanvasRef) {
        exCanvasRef.current = canvasRef.current;
      }

      if (imageUrl) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:next-line
        fabric.Image.fromURL(
          imageUrl,
          function (oImg: fabric.Image) {
            canvas.add(oImg);
            canvas.centerObject(oImg);
          },
          { opacity: 0.8 },
        );
      }
    }, []);

    const FabricWidthControlButton: React.FC<{ width: number }> = ({
      width,
    }) => (
      <div
        className={`block rounded-md h-5 w-5 px-0.5 flex items-center justify-center ${
          brushWidth === width ? "bg-[#ABABAB]" : ""
        }`}
        onClick={() => {
          if (fabricRef.current === null) {
            return;
          }

          setBrushWidth(width);
          fabricRef.current.freeDrawingBrush.width = width;
        }}
      >
        <div
          className='w-full bg-white rounded-md'
          style={{ height: `${width * 2}px` }}
        />
      </div>
    );

    return (
      <div
        className={`bg-white rounded-md grid grid-rows-[auto_1fr] ${className}`}
      >
        <div className='bg-[#817F83] rounded-tl-md rounded-tr-md flex justify-between items-center p-1'>
          <div className='flex justify-start items-center gap-1'>
            <PencilIcon
              style={{ backgroundColor: isDrawing ? "#AAAAAA" : "transparent" }}
              className='h-5 w-5 rounded-md active:bg-[#AAAAAA]'
              onClick={usePencil}
            />
            <EraserIcon
              style={{
                backgroundColor: !isDrawing ? "#AAAAAA" : "transparent",
              }}
              className='h-5 w-5 rounded-md active:bg-[#AAAAAA]'
              onClick={useEraser}
            />
            <UndoIcon
              className='h-5 w-5 rounded-md active:bg-[#AAAAAA]'
              onClick={undo}
            />
          </div>
          <div className='flex justify-end items-center gap-1'>
            <FabricColorControlButton
              initColor='#01BF5B'
              currentBrushColor={brushColor}
              fabricRef={fabricRef}
              setBrushColor={setBrushColor}
            />
            <FabricColorControlButton
              initColor='#DE1212'
              currentBrushColor={brushColor}
              fabricRef={fabricRef}
              setBrushColor={setBrushColor}
            />
            <FabricColorControlButton
              initColor='#F4C82A'
              currentBrushColor={brushColor}
              fabricRef={fabricRef}
              setBrushColor={setBrushColor}
            />
            <FabricWidthControlButton width={1} />
            <FabricWidthControlButton width={2} />
            <FabricWidthControlButton width={3} />
          </div>
        </div>
        <div
          onTouchStart={() => setHasInteracted(true)}
          onMouseDown={() => setHasInteracted(true)}
          ref={canvasContainer}
          className='relative flex border-md justify-center items-center'
        >
          <canvas
            ref={canvasRef}
            width='100%'
            height='100%'
            id='canvas'
            className='absolute'
          />
          {word && (
            <p className='absolute text-8xl font-bold opacity-40 pointer-events-none'>
              {word}
            </p>
          )}
          {shouldPing && !hasInteracted && (
            <DrawingHintIcon className='absolute right-10 bottom-10 motion-safe:animate-ping' />
          )}
        </div>
      </div>
    );
  },
);

export default DrawingField;
