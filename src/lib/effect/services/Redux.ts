import { Effect } from "effect";
import type { UnknownAction } from "@reduxjs/toolkit";
import { store } from "@/store";
import type { RootState } from "@/store";

/** @Service.Effect.Redux */
export class Redux extends Effect.Service<Redux>()("Redux", {
  sync: () => ({
    dispatch: (action: UnknownAction) => Effect.sync(() => store.dispatch(action)),
    getState: () => Effect.sync(() => store.getState() as RootState),
  }),
  accessors: true
}) { }

