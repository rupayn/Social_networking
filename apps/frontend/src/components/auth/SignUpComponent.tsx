import SignupFirstComp from "./signup/SignupFirstComp";
import useSignupForm from "../../hooks/useSignupForm";
import SignupSecondComp from "./signup/SignupSecondComp";
import SignupThirdComp from "./signup/SignupThirdComp";
import SignupFourthComp from "./signup/SignupFourthComp";

function SignUpComponent() {
  const { step, dataFields, nextStep, prevStep, updateDataFields,backToFirst } = useSignupForm();

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
        return <SignupSecondComp dataFields={dataFields} nextStep={nextStep} prevStep={prevStep} updateDataFields={updateDataFields}/>;
      case 2:
        return <SignupThirdComp dataFields={dataFields} nextStep={nextStep} prevStep={prevStep} updateDataFields={updateDataFields} />
      case 3:
        return <SignupFourthComp dataFields={dataFields} prevStep={prevStep} updateDataFields={updateDataFields}/>
      default:
        backToFirst();
    }
  };
  return <>{renderStep()}</>;
}

export default SignUpComponent;

/**
 *
 */
