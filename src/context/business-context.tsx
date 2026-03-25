import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type BusinessContextValue = {
  activeBusinessId: string;
  setActiveBusinessId: (value: string) => void;
  activeProjectId: string;
  setActiveProjectId: (value: string) => void;
};

const BUSINESS_STORAGE_KEY = "marketing-boost-active-business";
const PROJECT_STORAGE_KEY = "marketing-boost-active-project";

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export function BusinessProvider({ children }: PropsWithChildren) {
  const [activeBusinessId, setActiveBusinessIdState] = useState("");
  const [activeProjectId, setActiveProjectIdState] = useState("");

  useEffect(() => {
    const savedBusiness = window.localStorage.getItem(BUSINESS_STORAGE_KEY);
    const savedProject = window.localStorage.getItem(PROJECT_STORAGE_KEY);
    if (savedBusiness) {
      setActiveBusinessIdState(savedBusiness);
    }
    if (savedProject) {
      setActiveProjectIdState(savedProject);
    }
  }, []);

  const value = useMemo(
    () => ({
      activeBusinessId,
      setActiveBusinessId: (nextValue: string) => {
        setActiveBusinessIdState(nextValue);
        setActiveProjectIdState("");
        window.localStorage.setItem(BUSINESS_STORAGE_KEY, nextValue);
        window.localStorage.removeItem(PROJECT_STORAGE_KEY);
      },
      activeProjectId,
      setActiveProjectId: (nextValue: string) => {
        setActiveProjectIdState(nextValue);
        window.localStorage.setItem(PROJECT_STORAGE_KEY, nextValue);
      },
    }),
    [activeBusinessId, activeProjectId],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext must be used within BusinessProvider.");
  }

  return context;
}
