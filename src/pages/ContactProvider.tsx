import { FC, PropsWithChildren, createContext, useState } from "react";
import { IContact } from "./ChatPage";

export const ContactContext = createContext({
  getActiveContact(): IContact | null {
    return null;
  },
  setActiveContact(contact: IContact | null): void {
    throw new Error("Invalid contact");
  },
});

export const ContactProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeContact, setActiveContact] = useState(null as null | IContact);
  return (
    <ContactContext.Provider
      value={{
        getActiveContact() {
          return activeContact;
        },
        setActiveContact: setActiveContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
