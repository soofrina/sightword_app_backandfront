import { useState } from "@storybook/addons";
import PopUpModal from "../components/popup-model";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "Components/Pop-Up Modal",
  component: PopUpModal,
} as ComponentMeta<typeof PopUpModal>;

export const Base: ComponentStory<typeof PopUpModal> = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const onClose = () => setModalOpen(false);
  const onOpen = () => setModalOpen(true);

  return (
    <div>
      <button
        className='border rounded-xl py-1 px-2 bg-blue-400 text-white'
        onClick={onOpen}
      >
        Open Modal
      </button>
      <PopUpModal popUpTitle='Title' open={modalOpen} onClose={onClose}>
        <p>Content Here</p>
      </PopUpModal>
    </div>
  );
};
