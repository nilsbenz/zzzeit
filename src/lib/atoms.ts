import { atom } from "jotai";
import { Project } from "./types";

export const projectsAtom = atom<null | Project[]>(null);
