import * as Coord from "./coord"
import { F, O, T, TE } from "./fpts"
import * as Posix from "./posix"
import * as SiliTime from "./siliTime"
import * as SunData from "./sunData"

import "./index.css"

import { createSignal, JSX } from "solid-js"
import { render } from "solid-js/web"

const POLL_INTERVAL = 100

const [now, setNow] = createSignal<Posix.Posix>(Date.now())
const [location, setLocation] = createSignal<O.Option<Coord.Coord>>(O.none)
const [sunData, setSunData] = createSignal<O.Option<SunData.SunData>>(O.none)
const [displayError, setDisplayError] = createSignal<O.Option<Error>>(O.none)

navigator.geolocation.getCurrentPosition(
  async ({ coords: { latitude, longitude } }) => {
    const coord: Coord.Coord = [latitude, longitude]

    setLocation(() => {
      return O.some(coord)
    })

    void F.pipe(
      coord,
      SunData.fetchSunriseSunset,
      TE.foldW(
        error => {
          return T.fromIO(() => {
            console.log("PING", error)
            setDisplayError(O.some(error))
          })
        },
        res => {
          const utcOffsetSec = new Date(now()).getTimezoneOffset() * 60
          console.log(res)
          const sunData_ = SunData.toSunData(res, utcOffsetSec)
          return T.fromIO(() => setSunData(O.some(sunData_)))
        },
      ),
    )()
  },
)

const showError = (error: Error): string => {
  return `${error}`
}

setInterval(() => {
  setNow(Date.now())
}, POLL_INTERVAL)

const nowText = (): string => {
  return F.pipe(now(), now_ => String(now_).slice(0, 10))
}
const locationText = (): string =>
  F.pipe(
    location(),
    O.fold(() => "...", Coord.show),
  )

const legsAnHourText = (sunData_: SunData.SunData): string => {
  const legAnHour = 1 / SiliTime.legAnHour(sunData_)
  return String(legAnHour).slice(0, 4)
}

const negsAnHourText = (sunData_: SunData.SunData): string => {
  const negAnHour = 1 / SiliTime.negAnHour(sunData_)
  return String(negAnHour).slice(0, 4)
}

const siliTime = (sunData_: SunData.SunData): SiliTime.SiliTime => {
  return F.pipe(
    now(),
    Posix.toDaySecond,
    SiliTime.fromDaySeconds(sunData_),
    SiliTime.fromSet,
  )
}

const siliTimeText = (sunData_: SunData.SunData): string => {
  return F.pipe(sunData_, siliTime, SiliTime.show)
}

const percentCompletedText = (sunData_: SunData.SunData): string => {
  return F.pipe(
    sunData_,
    siliTime,
    SiliTime.percentCompleted,
    c => String(c * 100).slice(0, 4),
    v => `${v}%`,
  )
}

const displayErrorText = (): string =>
  F.pipe(
    displayError(),
    O.fold(() => "", showError),
  )

const hasError = (): boolean =>
  F.pipe(displayError(), O.map(F.constTrue), O.getOrElse(F.constFalse))

const App = (): JSX.Element => {
  return (
    <div class="p-8 space-y-4">
      {F.pipe(
        sunData(),
        O.fold(() => <p>Loading</p>, SiliTimeFoo),
      )}
      <div>
        <p>Date Time • {Posix.toDate(now())}</p>
      </div>
      <p>Posix: {nowText()}</p>
    </div>
  )
}

type SiliTimeFooProps = SunData.SunData
const SiliTimeFoo = (sunData_: SiliTimeFooProps): JSX.Element => {
  return (
    <>
      <h1 class="text-2xl font-bold mb-2">
        SILI TIME • {siliTimeText(sunData_)} • {percentCompletedText(sunData_)}
      </h1>
      {hasError() && <p>{displayErrorText()}</p>}

      <div>
        <h2>Location</h2>
        <p>{locationText()}</p>
        <p>{SunData.show(sunData_)}</p>
      </div>

      <div>
        <p>hours in a Leg: {legsAnHourText(sunData_)}</p>
        <p>hours in a Neg: {negsAnHourText(sunData_)}</p>
      </div>
    </>
  )
}

F.pipe(
  document.getElementById("app"),
  O.fromNullable,
  O.fold(
    () => {},
    r => render(() => <App />, r),
  ),
)
