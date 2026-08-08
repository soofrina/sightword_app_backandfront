import Toaster from "@base/components/toaster/toaster";

interface ErrorToasterProps {
  isOpen: boolean;
  className?: string;
  messageHeader?: string;
  messageBody?: string;
  onClose: () => void;
}

const ErrorToaster = (props: ErrorToasterProps) => {
  const { className = "", messageHeader, messageBody, isOpen, onClose } = props;

  return (
    <Toaster
      isSuccess={false}
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

export default ErrorToaster;
