import React, { LegacyRef, useEffect, useRef, useState } from "react";

import AppButton from "@base/components/app-button";
import sampleImg from "./sample.png";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import { ButtonColor, ButtonVariant } from "@base/type/appButton";
import DrawingField from "@base/components/drawing-field/drawingField";
import { useRecoilState } from "recoil";
import { uploadPersonalisedImage } from "@base/api/lessons";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import html2canvas from "html2canvas";
import { toastWrong } from "@base/utility/toast";
import {
  disableRightButtonSelector,
  maxProgressSelector,
  progressSelector,
} from "@recoil/journey";
import { ImageApprovalStatus } from "@base/type/dataTypes";
import { Progress } from "@base/type/lessonJourney";

interface PersonlisationPageProps {
  sentence: string;
  word: string;
  images: string[];
  wordAttemptId?: string;
  personalisedImageLink?: string | undefined;
  imageApprovalStatus: string;
  isPastStage?: boolean;
  onLoad?: (currentProgress?: Progress, maxProgress?: Progress) => void;
}

interface DrawingRef extends React.MutableRefObject<any> {
  saveDrawing: () => string;
  resetCanvas(): void;
  toPng(): string | null;
}

interface UploadFileInputRef extends React.MutableRefObject<any> {
  click: () => void;
}

const PersonlisationPage = ({
  sentence = "",
  word = "",
  images = [],
  personalisedImageLink = "",
  wordAttemptId = "",
  imageApprovalStatus = ImageApprovalStatus.PENDING,
  isPastStage = false,
  onLoad,
}: PersonlisationPageProps) => {
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const drawingRef = useRef<DrawingRef | null>(null);
  const uploadFileInputRef = useRef<UploadFileInputRef>(null);
  const [drawing, setDrawing] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );
  const [headerText, setHeaderText] = useState<JSX.Element>();
  const [currentProgress, setCurrentProgress] =
    useRecoilState(progressSelector);
  const [maxProgress, setMaxProgress] = useRecoilState(maxProgressSelector);

  useEffect(() => {
    if (isDrawMode || isUploadMode || !isApproved) {
      setIsRightButtonDisabled(true);
    }
  }, [isDrawMode, isUploadMode, isApproved]);

  useEffect(() => {
    onLoad && onLoad(currentProgress, maxProgress);
  }, []);

  useEffect(() => {
    if (isPastStage || personalisedImageLink) {
      setIsImageUploaded(true);
      setIsPendingApproval(true);
      setIsRightButtonDisabled(false);
    }

    if (imageApprovalStatus === ImageApprovalStatus.APPROVED) {
      setIsApproved(true);
      setIsPendingApproval(false);
    } else if (imageApprovalStatus === ImageApprovalStatus.REJECTED) {
      setIsApproved(false);
      setIsPendingApproval(false);
    }
  }, [isPastStage, personalisedImageLink]);

  const getHeaderText = (): JSX.Element => {
    if (isDrawMode && !drawing) {
      return (
        <p className='text-textSecondary font-medium'>
          Draw &quot;
          <span className='text-textPrimary'>{word}</span>
          &quot;
          <span className='italic'>{"- " + sentence}</span>
        </p>
      );
    } else if ((isImageUploaded || drawing) && isPendingApproval) {
      return (
        <p className='text-textSecondary font-medium'>
          <span className='text-textPrimary'>Pending approval...</span>
          <br></br>
          You can proceed to the next stage and check back later.
        </p>
      );
    } else if (isImageUploaded && !isPendingApproval && isApproved) {
      return (
        <p className='text-textSecondary font-medium'>
          🎉 Yay! your image for &quot;
          <span className='text-textPrimary'>Call</span>&quot; has been{" "}
          <span className='text-successMain'>approved</span>!
        </p>
      );
    } else if (isImageUploaded && !isPendingApproval && !isApproved) {
      return (
        <p className='text-textSecondary font-medium'>
          Oh no... Your image for &quot;
          <span className='text-textPrimary'>Call</span>&quot; has been{" "}
          <span className='text-errorMain'>rejected</span>.
        </p>
      );
    }

    return (
      <p className='text-textSecondary font-medium'>
        You can choose an <span className='text-textPrimary'>image</span> or{" "}
        <span className='text-textPrimary'>draw</span> to remember &quot;
        <span className='text-textPrimary'>{word}</span>
        &quot;
      </p>
    );
  };

  function dataURLtoBlob(dataURL: string): Blob | null {
    const arr = dataURL.split(",");
    if (!arr || arr.length === 0) {
      return null;
    }

    const prefix = arr[0].match(/:(.*?);/);
    if (prefix == null) {
      return null;
    }
    const mime = prefix[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const handleSaveDrawing = async () => {
    const saved = drawingRef.current?.saveDrawing();
    const pngUrl = drawingRef.current?.toPng();
    if (saved && pngUrl) {
      const extracted = extractSvgCode(saved);
      setDrawing(extracted);
      setPreview("");
      if (wordAttemptId === "") {
        toastWrong(
          "Something went wrong. Please refresh the page and try again.",
        );
        return;
      }

      const blob = dataURLtoBlob(pngUrl);
      if (!blob) {
        toastWrong(
          "Something went wrong. Please refresh the page and try again.",
        );
        return;
      }

      const file = new File([blob], `${wordAttemptId}.png`, {
        type: "image/png",
      });

      uploadPersonalisedImage(wordAttemptId, file).then((res) => {
        if (res.status === 201) {
          setIsImageUploaded(true);
          setIsPendingApproval(true);
          setIsUploadMode(false);
          setIsRightButtonDisabled(false);
        } else {
          toastWrong(
            "Something went wrong. Please refresh the page and try again.",
          );
        }
      });
    }
  };

  const handleFileUpload = (event: any, fileName: string) => {
    let file = event.target.files[0];
    setUploadedFile(file);
    const objectUrl = URL.createObjectURL(file);
    file = new File([file], `${fileName}.jpg`, { type: "image/jpeg" });
    setPreview(objectUrl);
    setDrawing("");
    uploadPersonalisedImage(wordAttemptId, file).then((res) => {
      if (res.status === 201) {
        setIsImageUploaded(true);
        setIsPendingApproval(true);
        setIsUploadMode(false);
        setIsRightButtonDisabled(false);
      } else {
        toastWrong(
          "Something went wrong. Please refresh the page and try again.",
        );
      }
    });
  };

  const extractSvgCode = (svg: string) => {
    const start = svg.indexOf("<svg");
    const end = svg.indexOf("</svg>");
    return svg.substring(start, end + 6);
  };

  const handleStartDraw = () => {
    // remove old drawing
    setDrawing("");

    setIsDrawMode(true);
  };

  // update header text when state changes
  useEffect(() => {
    setHeaderText(getHeaderText());
  }, [isImageUploaded, drawing, isPendingApproval, isApproved, isDrawMode]);

  useEffect(() => {
    if (isApproved) {
      setIsRightButtonDisabled(false);
    }
  }, [isApproved]);

  const lowercaseSentence = sentence.toLowerCase();
  const wordIdx = lowercaseSentence.indexOf(word.toLowerCase());
  // get part of sentence before the word
  const sentencePrefix = sentence.substring(0, wordIdx);
  // get part of sentence after the word
  const sentenceSuffix = sentence.substring(
    wordIdx + word.length,
    sentence.length,
  );

  return (
    <div className='w-full h-full flex justify-center'>
      <div className='text-center mt-4'>
        {headerText}
        {((!(isUploadMode || isDrawMode) && !isPendingApproval) ||
          isPendingApproval) && (
          <div className='flex flex-col items-center gap-2 my-0.5'>
            {!drawing && !preview && (
              <img
                src={
                  preview ??
                  (personalisedImageLink !== "" &&
                    personalisedImageLink != null &&
                    personalisedImageLink != undefined)
                    ? personalisedImageLink
                    : images[0]
                }
                className='max-h-36 aspect-auto'
              />
            )}
            <p className='italic text-textSecondary'>
              {sentencePrefix}
              <span className='text-textPrimary'>{word}</span>
              {sentenceSuffix}.
            </p>
          </div>
        )}
        {drawing !== "" && (
          <div className='flex justify-center max-h-40'>
            <img src={`data:image/svg+xml,${drawing}`} />
          </div>
        )}
        {preview && !isDrawMode && (
          <div className='flex justify-center max-h-40'>
            <img className='max-h-40 aspect-auto' src={preview} />
          </div>
        )}
        {isImageUploaded &&
          !isPendingApproval &&
          !isApproved &&
          !isDrawMode && (
            <p className='text-textSecondary font-medium w-full text-center mb-1'>
              <span className='text-textPrimary'>Why it was rejected:</span>{" "}
              Image is <span className='text-errorMain'>inappropriate</span> and{" "}
              <span className='text-errorMain'>inaccurate</span>.
            </p>
          )}
        {isDrawMode && !drawing && (
          <div className='text-center h-full flex justify-center'>
            <DrawingField className='mt-2 h-4/5 w-96' ref={drawingRef} />
            <AppButton
              className='absolute bottom-20 right-6'
              variant={ButtonVariant.SOLID}
              color={ButtonColor.PRIMARY}
              onClick={() => {
                handleSaveDrawing();
              }}
            >
              Upload
            </AppButton>
          </div>
        )}
        {!(isUploadMode || isDrawMode) && !isPendingApproval && !isApproved && (
          <div className='flex justify-center gap-3'>
            <AppButton
              onClick={handleStartDraw}
              variant={ButtonVariant.OUTLINED}
              color={ButtonColor.SECONDARY}
              startIcon={<EditIcon />}
            >
              Draw
            </AppButton>
            <AppButton
              onClick={() => {
                uploadFileInputRef.current?.click();
              }}
              startIcon={<ImageIcon />}
            >
              Choose Image
              <input
                type='file'
                hidden
                accept='image/*'
                onChange={(e) => handleFileUpload(e, wordAttemptId)}
                ref={
                  uploadFileInputRef as unknown as LegacyRef<HTMLInputElement>
                }
              />
            </AppButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonlisationPage;
