import { FC, PropsWithChildren, createContext, useState } from "react";

export const JournalContext = createContext({
  getActiveJournal(): IJournal | null {
    return null;
  },
  setActiveJournal(journal: IJournal | null): void {
    throw new Error("Invalid journal");
  },
});

export interface IJournal {
  title: string;
  owner: string;
  body: string;
}

export const JournalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeJournal, setActiveJournal] = useState(null as null | IJournal);
  return (
    <JournalContext.Provider
      value={{
        getActiveJournal() {
          return activeJournal;
        },
        setActiveJournal(journal) {
          setActiveJournal(journal);
        },
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
