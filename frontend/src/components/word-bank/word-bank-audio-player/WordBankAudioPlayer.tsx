import React, { useRef, useState } from "react";
import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";

interface WordBankAudioPlayerProps {
  audioPath: string;
  className?: string;
}

const WordBankAudioPlayer: React.FC<WordBankAudioPlayerProps> = ({
  audioPath,
  className = "cursor-pointer text-[#ABABAB] text-base",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the event from bubbling up

    const audioElement = audioRef.current;
    if (audioElement && audioPath) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio
        className='display-none'
        ref={audioRef}
        src={audioPath}
        preload='auto'
      ></audio>
      <VolumeUpOutlinedIcon onClick={toggleSound} className={className} />
    </>
  );
};

export default WordBankAudioPlayer;
