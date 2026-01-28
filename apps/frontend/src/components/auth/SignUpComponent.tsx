import SignupFirstComp from "./signup/SignupFirstComp";
import useSignupForm from "../../hooks/useSignupForm";

function SignUpComponent() {
  const { step, dataFields, nextStep, prevStep: _prevStep, updateDataFields } = useSignupForm();

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SignupFirstComp
            dataFields={dataFields}
            nextStep={nextStep}
            updateDataFields={updateDataFields}
          />
        );
      case 1:
        return <div>Second step</div>;
      default:
        return "null";
    }
  };
  return <>{renderStep()}</>;
}

export default SignUpComponent;

/**
 *
 */
