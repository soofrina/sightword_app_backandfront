import {ReactComponent as Cloud } from "../../student-home-page/previous-lesson/cloud.svg";
import {ReactComponent as CloudShadow } from "../../student-home-page/previous-lesson/cloudShadow.svg";

type WordToLearnProps = {
    word:string
}

const WordToLearn = ({word}: WordToLearnProps) => {
    return (
        <div className="relative flex items-center justify-center mt-3">
         <CloudShadow className="absolute z-0 top-1.5" />
      <Cloud className="relative z-10" />
      <div className="absolute text-center z-20">
        <div className="font-bold text-base">{word}</div>
        </div>
      </div>
     );
};
 
export default WordToLearn;