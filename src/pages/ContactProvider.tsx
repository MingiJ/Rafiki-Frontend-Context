import { FC, PropsWithChildren, createContext, useState } from "react";
import { IContact } from "./ChatPage";

export const ContactContext = createContext({
  getActiveContact(): IContact | null {
    return null;
  },
  setActiveContact(contact: IContact | null): void {
    throw new Error("Invalid contact");
  },
  getActiveGroup(): IGroup | null {
    return null;
  },
  setActiveGroup(group: IGroup | null): void {
    throw new Error("Invalid group");
  },
});

export interface IGroup {
  members: string[];
  owner: string;
  name: string;
  id: string;
}

export const ContactProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeContact, setActiveContact] = useState(null as null | IContact);

  const [activeGroup, setActiveGroup] = useState(null as null | IGroup);
  return (
    <ContactContext.Provider
      value={{
        getActiveContact() {
          return activeContact;
        },
        setActiveContact(contact) {
          setActiveGroup(null);
          setActiveContact(contact);
        },
        getActiveGroup() {
          return activeGroup;
        },
        setActiveGroup(group) {
          setActiveContact(null);
          setActiveGroup(group);
        },
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
