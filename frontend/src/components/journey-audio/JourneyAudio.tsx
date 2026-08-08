import { useRef, useState } from "react";
import play from "@base/assets/audio.jpg";
import pause from "@base/assets/pause.png";

interface JourneyAudioProps {
  audio: string | undefined;
}

const JourneyAudio = ({ audio }: JourneyAudioProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the event from bubbling up

    const audioElement = audioRef.current;
    if (audioElement) {
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
      <img
        onClick={toggleSound}
        src={isPlaying ? pause : play}
        className='w-28 h-8 cursor-pointer'
      />
      <audio
        className='display-none'
        ref={audioRef}
        src={audio}
        preload='auto'
      ></audio>
    </>
  );
};

export default JourneyAudio;
