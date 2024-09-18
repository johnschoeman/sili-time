type Resolved<T> = {
  _tag: "Resolved"
  data: T
}
export const Resolved = <T>(data: T): Resolved<T> => ({
  _tag: "Resolved",
  data,
})
type NotStarted = {
  _tag: "NotStarted"
}
export const NotStarted = (): NotStarted => ({ _tag: "NotStarted" })
type InFlight = {
  _tag: "InFlight"
}
export const InFlight = (): InFlight => ({ _tag: "InFlight" })
type RequestError<U> = {
  _tag: "RequestError"
  error: U
}
export const RequestError = <E>(error: E): RequestError<E> => ({
  _tag: "RequestError",
  error,
})

export type RemoteData<T, U> =
  | Resolved<T>
  | NotStarted
  | InFlight
  | RequestError<U>

export const map =
  <T, U, E>(f: (t: T) => U) =>
  (remoteData: RemoteData<T, E>): RemoteData<U, E> => {
    switch (remoteData._tag) {
      case "Resolved":
        return Resolved(f(remoteData.data))
      default:
        return remoteData
    }
  }

export const getOrElse =
  <T, E>(orElse: () => T) =>
  (remoteData: RemoteData<T, E>): T => {
    switch (remoteData._tag) {
      case "Resolved":
        return remoteData.data
      default:
        return orElse()
    }
  }

type MatchProps<T, U, E> = {
  onResolved: (data: T) => U
  onNotStarted: () => U
  onInFlight: () => U
  onRequestError: (error: E) => U
}
export const match =
  <T, U, E>({
    onResolved,
    onNotStarted,
    onInFlight,
    onRequestError,
  }: MatchProps<T, U, E>) =>
  (remoteData: RemoteData<T, E>): U => {
    switch (remoteData._tag) {
      case "Resolved":
        return onResolved(remoteData.data)
      case "NotStarted":
        return onNotStarted()
      case "InFlight":
        return onInFlight()
      case "RequestError":
        return onRequestError(remoteData.error)
    }
  }
