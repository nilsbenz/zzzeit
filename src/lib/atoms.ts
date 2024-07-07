import { atom } from "jotai";
import { Project, Tracker } from "./types";

export const projectsAtom = atom<null | Project[]>(null);
export const trackersAtom = atom<null | Tracker[]>(null);
