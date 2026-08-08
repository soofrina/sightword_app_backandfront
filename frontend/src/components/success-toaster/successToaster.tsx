import Toaster from "@base/components/toaster/toaster";

interface SuccessToasterProps {
  isOpen: boolean;
  className?: string;
  messageHeader?: string;
  messageBody?: string;
  onClose: () => void;
}

const SuccessToaster = (props: SuccessToasterProps) => {
  const { className = "", messageHeader, messageBody, isOpen, onClose } = props;

  return (
    <Toaster
      isSuccess={true}
      icon={true}
      isOpen={isOpen}
      className={className}
      messageHeader={messageHeader}
      messageBody={messageBody}
      vertical='bottom'
      horizontal='right'
      autoHide={true}
      onClose={onClose}
    ></Toaster>
  );
};

export default SuccessToaster;
