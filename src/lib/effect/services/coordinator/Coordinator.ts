/** @Service.Effect.Coordinator */

import { Effect } from "effect"
import type { WorkerTask, CoordinatorState, CoordinatorPhase } from "../../schemas/coordinator/CoordinatorSchema"

/** @Constant.Coordinator.MaxWorkers */
const MAX_CONCURRENT_WORKERS = 3

/** @Constant.Coordinator.WorkerTimeout */
const WORKER_TIMEOUT_MS = 60_000

/** @Service.Effect.Coordinator.Class */
export class CoordinatorService extends Effect.Service<CoordinatorService>()("Coordinator", {
  effect: Effect.gen(function* () {
    let coordinatorState: CoordinatorState = {
      workers: [],
      phase: "research",
      totalCost: 0
    }

    const createWorker = (
      prompt: string
    ): Effect.Effect<WorkerTask> =>
      Effect.sync(() => {
        const worker: WorkerTask = {
          id: `worker_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          prompt,
          status: "pending",
          startedAt: Date.now(),
          result: undefined,
          error: undefined,
          completedAt: undefined
        }
        coordinatorState = {
          ...coordinatorState,
          workers: [...coordinatorState.workers, worker]
        }
        return worker
      })

    const updateWorker = (
      workerId: string,
      update: Partial<Pick<WorkerTask, "status" | "result" | "error" | "completedAt">>
    ): Effect.Effect<WorkerTask | null> =>
      Effect.sync(() => {
        const idx = coordinatorState.workers.findIndex((w) => w.id === workerId)
        if (idx === -1) return null

        const existing = coordinatorState.workers[idx]!
        const updated: WorkerTask = {
          id: existing.id,
          prompt: existing.prompt,
          startedAt: existing.startedAt,
          status: update.status ?? existing.status,
          result: update.result !== undefined ? update.result : existing.result,
          error: update.error !== undefined ? update.error : existing.error,
          completedAt: update.completedAt !== undefined ? update.completedAt : existing.completedAt
        }
        const workers = [...coordinatorState.workers]
        workers[idx] = updated
        coordinatorState = { ...coordinatorState, workers }
        return updated
      })

    const setPhase = (
      phase: CoordinatorPhase
    ): Effect.Effect<CoordinatorState> =>
      Effect.sync(() => {
        coordinatorState = { ...coordinatorState, phase }
        return coordinatorState
      })

    const getState = (): Effect.Effect<CoordinatorState> =>
      Effect.sync(() => coordinatorState)

    const getPendingWorkers = (): Effect.Effect<WorkerTask[]> =>
      Effect.sync(() =>
        coordinatorState.workers.filter((w) => w.status === "pending" || w.status === "running")
      )

    const getCompletedWorkers = (): Effect.Effect<WorkerTask[]> =>
      Effect.sync(() =>
        coordinatorState.workers.filter((w) => w.status === "completed")
      )

    const canSpawnWorker = (): Effect.Effect<boolean> =>
      Effect.sync(() => {
        const active = coordinatorState.workers.filter(
          (w) => w.status === "pending" || w.status === "running"
        )
        return active.length < MAX_CONCURRENT_WORKERS
      })

    const buildWorkerPrompt = (
      task: string,
      context: string
    ): string =>
      `Eres un trabajador de investigación. Completa esta tarea de manera independiente y devuelve resultados estructurados.\n\nTarea: ${task}\n\nContexto:\n${context}\n\nDevuelve tus hallazgos en un formato estructurado.`

    const reset = (): Effect.Effect<void> =>
      Effect.sync(() => {
        coordinatorState = { workers: [], phase: "research", totalCost: 0 }
      })

    return {
      createWorker, updateWorker, setPhase, getState,
      getPendingWorkers, getCompletedWorkers, canSpawnWorker,
      buildWorkerPrompt, reset
    } as const
  })
}) {}

/** @Constant.Coordinator.Export */
export { MAX_CONCURRENT_WORKERS, WORKER_TIMEOUT_MS }
