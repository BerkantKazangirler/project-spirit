import { createContext, useContext, useState } from "react";

type DataContextType = {
  serverId: string;
  setServerId: (id: string) => void;
};

const DataContext = createContext<DataContextType>({
  serverId: "",
  setServerId: () => {},
});

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [serverId, setServerId] = useState<string>("");

  return (
    <DataContext.Provider
      value={{
        serverId,
        setServerId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
