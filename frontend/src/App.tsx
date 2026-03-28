import { fetchMissionData } from "./utils";
import Map from "./components";

export default function App() {
  const inputPromise = fetchMissionData();
  console.log(
    "Input verisi:",
    inputPromise.then((data: any) => console.log(data)),
  );

  return <Map />;
}
