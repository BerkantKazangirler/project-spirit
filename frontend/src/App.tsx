import { fetchMissionData } from "@/utils";

export default function App() {
  const inputPromise = fetchMissionData();
  console.log(
    "Input verisi:",
    inputPromise.then((data: any) => console.log(data)),
  );

  return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
}
