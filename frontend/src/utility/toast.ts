import { toast } from "react-toastify";

export const toastCorrect = (correctMsg?: string | undefined) => {
    if (correctMsg === undefined || typeof (correctMsg) === undefined) {
        correctMsg = "Great job! \n Tap on the next button on the right to continue.";
    }

    toast.success(correctMsg, {
        position: "bottom-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

export const toastWrong = (wrongMsg?: string | undefined) => {
    if (wrongMsg === undefined || typeof (wrongMsg) === undefined) {
        wrongMsg = "Uh-oh... That’s not quite right. Try again!";
    }
    toast.error(wrongMsg, {
        position: "bottom-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};