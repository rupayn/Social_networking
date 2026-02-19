import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { setTheme } from "../../../redux/features/theme.slice";
import { FaLightbulb, FaMoon } from "react-icons/fa6";
import { useState , useEffect } from "react";
import type { SignupDataFields } from "../../../hooks/useSignupForm";

import {
  useGetAddressFromPinCodeQuery,
  type PostOffice,
} from "../../../redux/features/api/utilsApi.sclice";
import { toast, Zoom } from "react-toastify";
import { signUpZodSchema } from "@repo/zod-schemas/config";


type Props = {
  dataFields: SignupDataFields;
  nextStep: () => void;
  prevStep: () => void;
  updateDataFields: (element: Partial<SignupDataFields>) => void;
};
// 
function SignupFourthComp({ dataFields, nextStep, prevStep, updateDataFields }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.value);

  const [pin, setPin] = useState(dataFields.successPin || "");
  const [manualEntry, setManualEntry] = useState(dataFields.enterManually || false);


  // RTK QUERY
  const {
    data: offices = [],
    isFetching,
    isError,
  } = useGetAddressFromPinCodeQuery(pin, {
    skip: pin.length !== 6,
    refetchOnMountOrArgChange: false,
  });

  // AUTO FILL FIRST RESULT
  useEffect(() => {
    if (!offices.length || manualEntry) return;

    const po = offices[0];
    updateDataFields({
      city: po.officename || po.regionname,
      dist: po.district,
      state: po.statename,
      country: "India",
      
    });
    if(pin.length === 6){
      updateDataFields({successPin:pin});
    }
  }, [offices, manualEntry]);
  const handlePinChange = (value: string) => {
    updateDataFields({ pinCode: value });
    setPin(value);
    setManualEntry(false);
    updateDataFields({enterManually:false});
  };

  const handleSelectPostOffice = (name: string) => {
    const po = offices.find((p) => p.officename === name);
    if (!po) return;

    updateDataFields({
      city: po.officename || po.regionname,
      dist: po.district,
      state: po.statename,
      country: "India",
    });
  };

  const handelNext=()=>{
    if(pin.length !== 6){
      toast.error(`PIN code must be 6 digits`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      return;
    }
    const res=signUpZodSchema.pick({ pinCode: true, city: true, dist: true, state: true, country: true })
    .safeParse({
      pinCode: dataFields.pinCode,
      city: dataFields.city,
      dist: dataFields.dist,
      state: dataFields.state,
      country: dataFields.country,
    });
    if(!res.success){
      toast.error(`${JSON.parse(res.error.message)[0].message}`, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      return;
    }

    nextStep();
  }
  useEffect(() => {
    if (isError) {
      toast.error("You can enter your address manually or just enter your PIN code and select from the results.", {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
      if(dataFields.successPin!==pin){
        updateDataFields({pinCode:dataFields.successPin});
        setPin(dataFields.successPin);  
      }
    }
  }, [isError]);
  useEffect(()=>{
    if(isFetching){
      toast.info(`Fetching address details... please wait `, {
        theme: theme === "dark" ? "light" : "dark",
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        transition: Zoom,
      });
    }
  },[isFetching])
  return (
    <div className="relative w-full max-w-md mx-auto px-6 py-2 flex flex-col gap-5">
      {/* THEME TOGGLE */}
      <button
        onClick={() => dispatch(setTheme())}
        className="sm:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-700 dark:bg-gray-200 text-white dark:text-black"
      >
        {theme === "dark" ? <FaMoon /> : <FaLightbulb />}
      </button>

      {/* PIN CODE */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-white">Pin Code 
          <span className="text-red-500 font-extrabold"> *</span>
        </label>
        <input
          type="text"
          maxLength={6}
          value={dataFields.pinCode}
          onChange={(e) => handlePinChange(e.target.value)}
          className="w-full bg-gray-700 text-gray-100 border rounded-full px-5 py-2.5"
        />

        {isFetching && <span className="text-xs font-extrabold dark:font-normal text-blue-900 dark:text-blue-400">Loading address…</span>}

        {isError && <span className="text-xs text-red-400">PIN not found. Enter manually.</span>}
      </div>

      {/* CITY */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-white">City / Village</label>
        <input
          type="text"
          value={dataFields.city}
          onChange={(e) => {
            updateDataFields({ city: e.target.value });
            setManualEntry(true);
            updateDataFields({enterManually:true});
          }}
          className="w-full bg-gray-700 text-gray-100 border rounded-full px-5 py-2.5"
        />
      </div>

      {/* SELECT ASSIST */}
      {offices.length > 1 && !manualEntry && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">Select from results</label>
          <select
            onChange={(e) => handleSelectPostOffice(e.target.value)}
            className="w-full bg-gray-700 text-gray-100 border rounded-full px-5 py-2.5"
          >
            {offices.map((po: PostOffice) => (
              <option key={po.officename} value={po.officename}>
                {po.officename}, {po.district}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              updateDataFields({enterManually:true});
              setManualEntry(true)
            }}
            className="text-xs underline text-blue-500 self-start"
          >
            Enter manually
          </button>
        </div>
      )}

      {/* DISTRICT */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-white">District</label>
        <input
          type="text"
          value={dataFields.dist}
          onChange={(e) => {
            updateDataFields({ dist: e.target.value });
            setManualEntry(true);
          }}
          className="w-full bg-gray-700 text-gray-100 border rounded-full px-5 py-2.5"
        />
      </div>

      {/* STATE */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-white">State</label>
        <input
          type="text"
          value={dataFields.state}
          onChange={(e) => {
            updateDataFields({ state: e.target.value });
            setManualEntry(true);
          }}
          className="w-full bg-gray-700 text-gray-100 border rounded-full px-5 py-2.5"
        />
      </div>

      {/* COUNTRY */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black dark:text-white">Country</label>
        <input
          type="text"
          value={dataFields.country}
          disabled
          className="w-full bg-gray-700 text-gray-100 border rounded-full px-5 py-2.5 opacity-70"
        />
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between gap-4 pt-4">
        <button
          onClick={prevStep}
          className="w-full bg-emerald-600 rounded-full py-2 hover:bg-emerald-800 text-white"
        >
          {"<- "}Prev
        </button>

        <button
          onClick={handelNext}
          className="w-full bg-blue-600 rounded-full py-2 hover:bg-blue-800 text-white"
        >
          Next{" ->"}
        </button>
      </div>
    </div>
  );
}

export default SignupFourthComp;